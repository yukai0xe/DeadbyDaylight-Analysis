<template>
    <div class="wrap">
        <div class="hud">
            <div class="hud-left">
                <div class="pill">Bloodpoints: <b>{{ bloodpoints }}</b></div>
                <div class="pill">Zoom: <b>{{ zoomText }}</b></div>
                <div class="pill">Nodes: <b>{{ state.graph.nodes.length }}</b></div>
            </div>

            <div class="hud-right">
                <button class="btn" @click="reset()">Reset</button>
                <button class="btn" @click="reroll()">Reroll</button>
            </div>
        </div>

        <div ref="host" class="stage"></div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import type { BloodGraph, BloodNode, NodeState } from '@/types/components'
import { generateBloodweb } from '@/helper/generator'

const host = ref<HTMLDivElement | null>(null)

const state = reactive({
    bloodpoints: 8000,
    seed: 42,
    graph: generateBloodweb({ layers: 4, seed: 42 }),
})

const bloodpoints = computed(() => state.bloodpoints)
const zoomText = computed(() => {
    if (!world) return '100%'
    return (world.scale.x * 100).toFixed(0) + '%'
})

let app: PIXI.Application | null = null
let world: PIXI.Container;
let edgesLayer: PIXI.Container
let nodesLayer: PIXI.Container

// nodeId -> sprite
const nodeG = new Map<string, PIXI.Container>()
const nodeCircle = new Map<string, PIXI.Graphics>()
const edgeG = new Map<string, PIXI.Graphics>()

// 平移/縮放
let isPanning = false
let panStart = { x: 0, y: 0, wx: 0, wy: 0 }

const COLORS: Record<NodeState, number> = {
    locked: 0x2b2b31,
    available: 0xe7e7ea,
    purchased: 0xff2d2d,
    corrupted: 0x6b0f0f,
}

function reset() {
    state.bloodpoints = 8000
    state.seed = 42
    state.graph = generateBloodweb({ layers: 4, seed: state.seed })
    rebuild()
}

function reroll() {
    state.bloodpoints = 8000
    state.seed += 1
    state.graph = generateBloodweb({ layers: 4, seed: state.seed })
    rebuild()
}

function rebuild() {
    if (!app || !world) return

    gsap.globalTimeline.clear()

    edgesLayer.removeChildren().forEach(c => c.destroy())
    nodesLayer.removeChildren().forEach(c => c.destroy())

    nodeG.clear()
    nodeCircle.clear()
    edgeG.clear()

    drawGraph(state.graph)
}

function drawGraph(graph: BloodGraph) {
    // edges
    for (const e of graph.edges) {
        const line = new PIXI.Graphics()
        line.alpha = 0.55
        line.lineStyle(3, 0xffffff, 0.12)
        const a = graph.nodes.find(n => n.id === e.from)!
        const b = graph.nodes.find(n => n.id === e.to)!
        line.moveTo(a.x, a.y)
        line.lineTo(b.x, b.y)
        edgesLayer.addChild(line)
        edgeG.set(e.id, line)
    }

    // nodes
    for (const n of graph.nodes) {
        const container = new PIXI.Container()
        container.x = n.x
        container.y = n.y

        const circle = new PIXI.Graphics()
        circle.beginFill(COLORS[n.state])
        circle.drawCircle(0, 0, 22)
        circle.endFill()

        // 外圈（可用來做解鎖發光）
        const ring = new PIXI.Graphics()
        ring.lineStyle(2, 0x000000, 0.25)
        ring.drawCircle(0, 0, 28)

        // 互動區域
        container.eventMode = 'static'
        container.cursor = 'pointer'
        container.hitArea = new PIXI.Circle(0, 0, 30)

        container.on('pointerover', () => {
            gsap.to(container.scale, { x: 1.06, y: 1.06, duration: 0.12 })
        })
        container.on('pointerout', () => {
            gsap.to(container.scale, { x: 1, y: 1, duration: 0.12 })
        })
        container.on('pointerdown', () => onClickNode(n.id))

        container.addChild(circle)
        container.addChild(ring)
        nodesLayer.addChild(container)

        nodeG.set(n.id, container)
        nodeCircle.set(n.id, circle)

        // 初始淡入動畫（帶點“生成感”）
        container.alpha = 0
        gsap.to(container, { alpha: 1, duration: 0.25, delay: Math.random() * 0.2 })
    }
}

function setNodeState(nodeId: string, newState: NodeState, animate = true) {
    const node = state.graph.nodes.find(n => n.id === nodeId)
    if (!node) return
    node.state = newState

    const circle = nodeCircle.get(nodeId)
    if (!circle) return

    if (animate) {
        // 先閃一下再換色
        const c = nodeG.get(nodeId)
        if (c) gsap.fromTo(c, { alpha: 0.65 }, { alpha: 1, duration: 0.18 })
    }

    circle.clear()
    circle.beginFill(COLORS[newState])
    circle.drawCircle(0, 0, 22)
    circle.endFill()
}

function neighbors(nodeId: string) {
    const { edges } = state.graph
    const nb = new Set<string>()
    for (const e of edges) {
        if (e.from === nodeId) nb.add(e.to)
        if (e.to === nodeId) nb.add(e.from)
    }
    return Array.from(nb)
}

function onClickNode(nodeId: string) {
    const node = state.graph.nodes.find(n => n.id === nodeId)
    if (!node) return

    if (node.state !== 'available') {
        // 不能點：做一個小抖動提示
        const c = nodeG.get(nodeId)
        if (c) gsap.to(c, { x: c.x + 6, yoyo: true, repeat: 3, duration: 0.05 })
        return
    }

    if (state.bloodpoints < node.cost) {
        const c = nodeG.get(nodeId)
        if (c) gsap.to(c, { rotation: 0.12, yoyo: true, repeat: 3, duration: 0.06 })
        return
    }

    // 消耗血點、購買
    state.bloodpoints -= node.cost
    setNodeState(nodeId, 'purchased', true)

    // 解鎖鄰居：locked -> available
    for (const nb of neighbors(nodeId)) {
        const n = state.graph.nodes.find(x => x.id === nb)
        if (n && n.state === 'locked') {
            setNodeState(nb, 'available', true)
            // 解鎖的“亮一下”
            const c = nodeG.get(nb)
            if (c) {
                gsap.fromTo(c.scale, { x: 0.85, y: 0.85 }, { x: 1, y: 1, duration: 0.2 })
            }
        }
    }

    // 侵蝕（DBD 風格）：買完後，隨機從可用節點開始侵蝕 1~3 步
    startCorruptionWave()
}

function startCorruptionWave() {
    const candidates = state.graph.nodes.filter(n => n.state === 'available' && n.id !== 'center')
    if (candidates.length === 0) return

    const start = candidates[Math.floor(Math.random() * candidates.length)]
    const steps = 1 + Math.floor(Math.random() * 3)

    let frontier = [start!.id]
    let done = new Set<string>()

    for (let i = 0; i < steps; i++) {
        const nextFrontier: string[] = []
        for (const id of frontier) {
            if (done.has(id)) continue
            done.add(id)

            const n = state.graph.nodes.find(x => x.id === id)
            if (!n) continue
            if (n.state === 'available') {
                // 延遲做“吞噬”動畫
                const delay = i * 0.18 + Math.random() * 0.08
                gsap.delayedCall(delay, () => {
                    setNodeState(id, 'corrupted', true)
                    // 侵蝕粒子感（簡易：scale + alpha）
                    const c = nodeG.get(id)
                    if (c) {
                        gsap.fromTo(c.scale, { x: 1.1, y: 1.1 }, { x: 1, y: 1, duration: 0.22 })
                    }
                })
            }

            const nbs = neighbors(id).filter(nb => {
                const t = state.graph.nodes.find(x => x.id === nb)
                return t?.state === 'available'
            })

            // 侵蝕走向：隨機挑一些延伸
            for (const nb of nbs) {
                if (Math.random() < 0.55) nextFrontier.push(nb)
            }
        }
        frontier = nextFrontier.length ? nextFrontier : []
        if (!frontier.length) break
    }
}

function setupPanZoom() {
    if (!app || !world) return

    const canvas = app.view as HTMLCanvasElement

    let isDragging = false
    let lastX = 0
    let lastY = 0

    canvas.addEventListener('pointerdown', (e) => {

        // 🔥 如果點到節點就不要啟動拖曳
        const target = e.target as HTMLElement
        if (target !== canvas) return

        isDragging = true
        lastX = e.clientX
        lastY = e.clientY
    })

    canvas.addEventListener('pointermove', (e) => {
        if (!isDragging) return

        const dx = e.clientX - lastX
        const dy = e.clientY - lastY

        world!.x += dx
        world!.y += dy

        lastX = e.clientX
        lastY = e.clientY
    })

    canvas.addEventListener('pointerup', () => {
        isDragging = false
    })

    canvas.addEventListener('pointerleave', () => {
        isDragging = false
    })

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault()

        const direction = e.deltaY > 0 ? -1 : 1
        const factor = direction > 0 ? 1.1 : 0.9

        const newScale = clamp(world!.scale.x * factor, 0.3, 2)
        world!.scale.set(newScale)

    }, { passive: false })
}


function screenToworld(sx: number, sy: number) {
    // 反推（大概即可）：world! 轉換 = (screen - world!Pos) / scale
    return {
        x: (sx - world!.x) / world!.scale.x,
        y: (sy - world!.y) / world!.scale.y,
    }
}

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v))
}

function resizeCanvas() {
    if (!host.value || !app) return

    const w = host.value.clientWidth
    const h = host.value.clientHeight

    app.renderer.resize(w, h)

    world.x = w / 2
    world.y = h / 2
}

onMounted(async () => {

    if (!host.value) return

    app = new PIXI.Application({
        width: 1,
        height: 1,
        backgroundColor: 0x0b0b0f,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
    })

    host.value.appendChild(app.view as HTMLCanvasElement)

    world = new PIXI.Container()
    edgesLayer = new PIXI.Container()
    nodesLayer = new PIXI.Container()

    world.sortableChildren = true
    world.eventMode = 'static'

    if (world != null) {
        world!.addChild(edgesLayer)
        world!.addChild(nodesLayer)
        app.stage.addChild(world)
        world.x = host.value.clientWidth / 2
        world.y = host.value.clientHeight / 2
        world.scale.set(0.85)
    }


    drawGraph(state.graph)
    setupPanZoom()

    requestAnimationFrame(() => {
        resizeCanvas()
    })
    window.addEventListener('resize', resizeCanvas)
})

onBeforeUnmount(() => {

    gsap.globalTimeline.clear()
    if (app) {
        app?.stop()
    }
})
</script>

<style lang="css" scoped>
.wrap {
    width: 100vw;
    position: relative;
    flex: 1;
    height: 100%;
    overflow: hidden;
}

.stage {
    position: absolute;
    inset: 0;
}

.hud {
    position: absolute;
    left: 12px;
    right: 12px;
    top: 12px;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    pointer-events: none;
}

.hud-left,
.hud-right {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
}

.pill {
    pointer-events: none;
    background: rgba(255, 255, 255, .06);
    border: 1px solid rgba(255, 255, 255, .10);
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 12px;
    backdrop-filter: blur(6px);
}

.btn {
    pointer-events: auto;
    cursor: pointer;
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, .15);
    background: rgba(255, 255, 255, .08);
    color: #fff;
}

.btn:hover {
    background: rgba(255, 255, 255, .12);
}
</style>

import type { BloodEdge, BloodGraph, BloodNode } from '@/types/components'

function seededRand(seed: number) {
    // 簡單 deterministic RNG（不依賴外部 lib）
    let s = seed >>> 0
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0
        return s / 0xffffffff
    }
}

export function generateBloodweb(opts?: {
    layers?: number
    centerX?: number
    centerY?: number
    seed?: number
}): BloodGraph {
    const layers = opts?.layers ?? 4
    const cx = opts?.centerX ?? 0
    const cy = opts?.centerY ?? 0
    const rand = seededRand(opts?.seed ?? 42)

    const nodes: BloodNode[] = []
    const edges: BloodEdge[] = []

    // 中心節點
    nodes.push({
        id: 'center',
        name: 'Center',
        layer: 0,
        cost: 0,
        x: cx,
        y: cy,
        state: 'available',
    })

    // 每層生成一圈節點（可調整數量與半徑）
    for (let layer = 1; layer <= layers; layer++) {
        const count = 8 + layer * 4
        const radius = 120 + layer * 110

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + (rand() - 0.5) * 0.18
            const jitter = (rand() - 0.5) * 18

            const x = cx + Math.cos(angle) * (radius + jitter)
            const y = cy + Math.sin(angle) * (radius + jitter)

            nodes.push({
                id: `n_${layer}_${i}`,
                name: `Node ${layer}-${i}`,
                layer,
                cost: 500 + layer * 250,
                x,
                y,
                state: 'locked',
            })
        }
    }

    // 連線：同層相鄰 + 連到上一層最近的 1~2 個節點
    const byLayer = new Map<number, BloodNode[]>()
    for (const n of nodes) {
        if (!byLayer.has(n.layer)) byLayer.set(n.layer, [])
        byLayer.get(n.layer)!.push(n)
    }

    let edgeId = 0
    const addEdge = (from: string, to: string) => {
        edges.push({ id: `e_${edgeId++}`, from, to })
    }

    // 同層環狀連線
    for (let layer = 1; layer <= layers; layer++) {
        const arr = byLayer.get(layer) ?? []
        for (let i = 0; i < arr.length; i++) {
            const a = arr[i]
            const b = arr[(i + 1) % arr.length]
            addEdge(a!.id, b!.id)
        }
    }

    // 跨層連線
    for (let layer = 1; layer <= layers; layer++) {
        const cur = byLayer.get(layer) ?? []
        const prev = byLayer.get(layer - 1) ?? []
        for (const n of cur) {
            // 找上一層距離最近的節點
            const sorted = [...prev].sort((p1, p2) => dist2(n, p1) - dist2(n, p2))
            if (sorted[0]) addEdge(n.id, sorted[0].id)
            // 有機率多連一條（讓路徑更像網）
            if (sorted[1] && rand() < 0.55) addEdge(n.id, sorted[1].id)
        }
    }

    // 初始解鎖：中心相連的那一圈（layer 1）
    const layer1 = byLayer.get(1) ?? []
    for (const n of layer1) n.state = 'available'

    return { nodes, edges }
}

function dist2(a: { x: number; y: number }, b: { x: number; y: number }) {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return dx * dx + dy * dy
}

<template>
    <div class="dbd-dropdown">
        <div class="dropdown-wrapper" :class="{ focused: open }" @click="toggle">
            <span class="selected">{{ selectedLabel || placeholder }}</span>
            <span class="arrow">▼</span>
        </div>

        <div v-if="open" class="dropdown-menu">
            <div
                v-for="(option, idx) in options"
                :key="option.value"
                class="dropdown-item"
                @mouseenter="hoveredOption = idx"
                @mouseleave="hoveredOption = null"
                 @click.stop="select(option)"
            >
                <span @click.stop="select(option)">{{ option.label }}</span>

                <div v-if="option.children.length && hoveredOption === idx" class="dropdown-submenu">
                    <div v-for="child in option.children" :key="child.value" class="dropdown-item"
                        @click.stop="select(child)">
                        {{ child.label }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue"

interface Option {
    label: string
    value: string | number | null
    children?: Option[]
}

const props = defineProps<{
    modelValue: string | number | null
    options: Option[]
    placeholder?: string
}>()

const emit = defineEmits(["update:modelValue"])

const open = ref(false)
const hoveredOption = ref<number | null>(null)

const selectedLabel = computed(() =>
    props.options.flatMap(o => [o, ...(o.children || [])])
        .find(o => o.value === props.modelValue)?.label
)

function toggle() {
    open.value = !open.value
}

function select(option: Option) {
    emit("update:modelValue", option.value)
    open.value = false
}

function handleClickOutside(e: MouseEvent) {
    if (!(e.target as HTMLElement).closest(".dbd-dropdown")) {
        open.value = false
    }
}

onMounted(() => window.addEventListener("click", handleClickOutside))
onBeforeUnmount(() => window.removeEventListener("click", handleClickOutside))
</script>

<style scoped>
.dbd-dropdown {
    position: relative;
    width: 220px;
}

/* ===== Wrapper ===== */
.dropdown-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    background: #0f0f0f;
    border: 1px solid #333;
    border-radius: 6px;

    padding: 12px 14px;
    cursor: pointer;

    transition: 0.3s;

    box-shadow: inset 0 0 10px rgba(0, 0, 0, .6);
}

.dropdown-wrapper:hover {
    border-color: #555;
}

.dropdown-wrapper.focused {
    border-color: #e73727;
    box-shadow:
        0 0 8px rgba(231, 55, 39, .6),
        inset 0 0 10px rgba(0, 0, 0, .6);
}

.selected {
    color: #ddd;
    font-size: 14px;
    letter-spacing: 1px;
}

.arrow {
    color: #777;
    font-size: 12px;
}

/* ===== Menu ===== */
.dropdown-menu {
    position: absolute;
    top: 110%;
    width: 100%;

    background: #0f0f0f;
    border: 1px solid #333;
    border-radius: 6px;
    text-align: left;

    z-index: 50;

    box-shadow:
        0 0 12px rgba(0, 0, 0, .8);
}

/* ===== Item ===== */
.dropdown-item {
    position: relative;
    padding: 10px 14px;
    color: #bbb;
    cursor: pointer;
    transition: .25s;
}

.dropdown-item:hover {
    background: #e73727;
    color: white;
}

/* scratch texture */
.dropdown-menu::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(115deg,
            rgba(255, 255, 255, .03) 0px,
            rgba(255, 255, 255, .03) 1px,
            transparent 1px,
            transparent 8px);
    opacity: .3;
}

.dropdown-submenu {
    position: absolute;
    top: 0;
    left: 100%;
    min-width: 180px;

    background: #0f0f0f;
    border: 1px solid #333;
    border-radius: 6px;
    box-shadow: 0 0 12px rgba(0, 0, 0, .8);

    max-height: calc(7 * 42px);
    overflow-y: auto;

    z-index: 100;
}

.dropdown-submenu .dropdown-item:hover {
    background: #e73727;
    color: white;
}
</style>
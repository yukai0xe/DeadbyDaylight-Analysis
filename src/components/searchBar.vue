<template>
    <div class="dbd-search">
        <div class="search-wrapper" :class="{ focused: isFocused }">
            <input v-model="model" type="text" placeholder="Search the Fog..." @focus="isFocused = true"
                @blur="isFocused = false" @keydown.enter="emitSearch" />

            <button class="search-btn" @click="emitSearch">
                SEARCH
            </button>

            <button v-if="model.length" class="clear-btn" @click="clear">
                ✕
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

const props = defineProps<{
    modelValue: string
}>()

const emit = defineEmits(["update:modelValue", "search"])

const isFocused = ref(false)

const model = computed({
    get: () => props.modelValue,
    set: (v: string) => emit("update:modelValue", v)
})

function emitSearch() {
    emit("search", model.value.trim())
}

function clear() {
    emit("update:modelValue", "")
}
</script>

<style scoped>
/* ===== Container ===== */
.dbd-search {
    width: 100%;
    max-width: 500px;
}

/* ===== Wrapper ===== */
.search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: #0f0f0f;
    border: 1px solid #333;
    border-radius: 6px;
    overflow: hidden;
    transition: 0.3s;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6);
}

/* Hover metal effect */
.search-wrapper:hover {
    border-color: #555;
}

/* Focus blood glow */
.search-wrapper.focused {
    border-color: #e73727;
    box-shadow:
        0 0 8px rgba(231, 55, 39, 0.6),
        inset 0 0 10px rgba(0, 0, 0, 0.6);
}

/* ===== Input ===== */
.search-wrapper input {
    flex: 1;
    background: transparent;
    border: none;
    color: #ddd;
    padding: 12px 14px;
    font-size: 14px;
    letter-spacing: 1px;
}

.search-wrapper input::placeholder {
    color: #555;
}

.search-wrapper input:focus {
    outline: none;
}

/* ===== Search Button ===== */
.search-btn {
    background: #1a1a1a;
    color: #bbb;
    border: none;
    padding: 10px 16px;
    cursor: pointer;
    font-size: 12px;
    letter-spacing: 1px;
    transition: 0.3s;
}

.search-btn:hover {
    background: #e73727;
    color: white;
}

/* ===== Clear Button ===== */
.clear-btn {
    position: absolute;
    right: 90px;
    background: transparent;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 14px;
}

.clear-btn:hover {
    color: #e73727;
}

/* ===== Subtle scratch texture ===== */
.search-wrapper::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(115deg,
            rgba(255, 255, 255, 0.03) 0px,
            rgba(255, 255, 255, 0.03) 1px,
            transparent 1px,
            transparent 8px);
    opacity: 0.3;
}
</style>

<template>
    <div class="marquee-track" :style="{
        animationDuration: speed,
        animationDirection: reverse ? 'reverse' : 'normal'
    }">
        <div
            v-for="item in shuffledItems"
            :key="'a' + item.id"
            class="icon-item"
            @click="handleClick(item.id)">
            <img
                :title="item.title"
                :src="item.icon"
                :class="{ active: selected?.has(item.id) }"
            />
        </div>

        <div
            v-for="item in shuffledItems"
            :key="'b' + item.id"
            class="icon-item"
            @click="handleClick(item.id)">
            <img
                :title="item.title"
                :src="item.icon"
                :class="{ active: selected?.has(item.id) }"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MarqueeItemType } from "@/types/components";
import { ref, watch } from "vue";
const props = defineProps<{
    items: MarqueeItemType[];
    speed?: string;
    reverse?: boolean;
    selected?: Set<string>;
    onClick?: (id: string) => void;
}>();

const emits = defineEmits<{
    (e: 'select', id: string): void;
}>();

const handleClick = (id: string) => {
    emits('select', id);
};

const shuffleOnce = ref(false);
const shuffleArray = <T>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const shuffledItems = ref([]);
watch(
    () => props.items,
    (newItems) => {
        if(newItems.length == 0 || shuffleOnce.value) return;
        shuffledItems.value = shuffleArray(newItems);
        shuffleOnce.value = true;
    },
    { immediate: true }
);
</script>

<style lang="css" scoped>

.marquee-track {
    display: flex;
    gap: 40px;
    width: max-content;
    animation: scrollLeft 40s linear infinite;
}

.marquee-track:hover {
    animation-play-state: paused;
}

.icon-item img {
    cursor: pointer;
    width: 80px;
    height: 80px;
    opacity: 0.15;
    transition: 0.3s ease;
}

.icon-item img:hover, .icon-item img.active {
    opacity: 1;
    transform: scale(1.1);
}

.icon-item {
    position: relative;
    overflow: hidden;
}

@keyframes scrollLeft {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(-50%);
    }
}
</style>
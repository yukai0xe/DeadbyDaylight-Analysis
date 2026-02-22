<template>
    <div class="perk-box">
        <div class="perk-icon-wrapper">
            <img :src="addOns.icon" alt="perk image" class="perk-image" />
        </div>

        <div class="perk-info">
            <h3 class="perk-name">{{ addOns.name }}</h3>
            <p class="perk-description" v-html="addOns.description"></p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AddOns } from "@/types/addOns";

const props = defineProps<{
    addOns: AddOns;
}>();
</script>

<style lang="css" scoped>
.perk-box {
    position: relative;
    display: flex;
    gap: 1rem;
    padding: 1.2rem;
    background: radial-gradient(circle at top left,
            rgba(120, 0, 0, 0.4),
            #0f0f0f 60%),
        #0b0b0b;

    border: 1px solid rgba(160, 0, 0, 0.6);
    border-radius: 10px;

    box-shadow:
        0 0 10px rgba(120, 0, 0, 0.4),
        inset 0 0 20px rgba(0, 0, 0, 0.8);

    transition: all 0.3s ease;
    cursor: pointer;
}

.perk-box:hover {
    transform: scale(1.02);
    border-color: #c1121f;
    box-shadow:
        0 0 20px rgba(200, 0, 0, 0.8),
        inset 0 0 25px rgba(0, 0, 0, 1);
}

/* Icon */
.perk-icon-wrapper {
    flex-shrink: 0;
    width: 90px;
    height: 90px;
    background: #111;
    border: 2px solid #2a0000;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow:
        0 0 8px rgba(150, 0, 0, 0.6);
}

.perk-image {
    width: 80px;
    height: 80px;
    object-fit: contain;
    filter: drop-shadow(0 0 6px rgba(200, 0, 0, 0.7));
}

/* Text area */
.perk-info {
    flex: 1;
}

.perk-name {
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: #e8c252;
    /* DBD 金色 */
    margin-bottom: 0.5rem;
    text-transform: uppercase;
}

.perk-description {
    font-size: 0.9rem;
    line-height: 1.4;
    color: #ddd;
    opacity: 0.85;
}

.perk-box::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255, 0, 0, 0.15), transparent 70%);
    opacity: 0;
    transition: opacity 0.4s;
}

.perk-box:hover::before {
    opacity: 1;
}
</style>
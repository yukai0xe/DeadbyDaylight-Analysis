<template>
    <div class="marquee-wrapper">
        <div class="marquee">
            <MarqueeRow
                v-for="(rowItems, index) in distributedRows"
                :key="index"
                :items="rowItems"
                :speed="props.rows[index].speed"
                :selected="selected"
                :reverse="props.rows[index].reverse"
                @select="forwardClick"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import MarqueeRow from './marqueeRow.vue';
import { MarqueeItemType, MarqueeRowType  } from '@/types/components';

const props = defineProps<{
    items: MarqueeItemType[];
    selected?: Set<string>;
    rows: MarqueeRowType[];
    onClick?: (id: string) => void;
}>();

const emits = defineEmits<{
    (e: 'select', id: string): void;
}>();

const forwardClick = (id: string) => {
    emits('select', id);
};

const distributedRows = computed(() => {
    const result: { id: string; icon: string }[][] = [];
    for (let i = 0; i < props.rows.length; i++) {
        result.push([]);
    }
    props.items.forEach((item, index) => {
        const rowIndex = index % props.rows.length;
        result[rowIndex].push(item);
    });

    return result;
});

</script>

<style lang="css" scoped>
.marquee-wrapper {
    width: 100%;
    overflow: hidden;
    background: #071d2d;
    padding: 40px 0;
}

.marquee-wrapper::before,
.marquee-wrapper::after {
    content: "";
    position: absolute;
    top: 0;
    width: 150px;
    height: 100%;
    z-index: 2;
    pointer-events: none;
}

.marquee-wrapper::before {
    left: 0;
    background: linear-gradient(to right, #071d2d, transparent);
}

.marquee-wrapper::after {
    right: 0;
    background: linear-gradient(to left, #071d2d, transparent);
}

.marquee {
    position: relative;
    width: 100%;
}
</style>
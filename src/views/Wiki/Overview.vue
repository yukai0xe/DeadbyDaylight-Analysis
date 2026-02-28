<template>
    <div class="wiki-overview flex justify-content-center align-items-center flex-column">
        <div v-if="!data.length">
            <img src="@/assets/picture/loading.gif" alt="loading">
        </div>
        <div v-else class="illustrated">
            <div class="scroll">
                <Marquee :selected="selectedId" :rows="marqueeRows" :items="marqueeItems" @select="clickHandler" />
            </div>
        </div>

        <div class="information-container flex justify-content-center align-items-center flex-column p-5 mt-7">
            <div class="toolbar">
                <DropDown v-model="selectedLang" :options="langOptions" placeholder="Choose Lang" class="w-80" />
                <SearchBar placeholder="Search Perks..." v-model="searchKeyword" />
                <slot name="toolbar"/>
            </div>
            <div v-if="selectCount !== 0" class="my-5">
                <n-button class="mx-2" type="tertiary" @click="clearClickHandler">{{ selectCount }}</n-button>
                <n-button class="mx-2" type="tertiary" @click="clearClickHandler">Clear All</n-button>
            </div>

            <div class="content-area">
                <slot name="content"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T">
import SearchBar from "@/components/searchBar.vue";
import DropDown from "@/components/dropDown.vue";
import { NButton } from "naive-ui";
import Marquee from "@/components/marquee.vue";
import { computed } from "vue";
import { MarqueeRowType, MarqueeItemType, Option } from "@/types/components";
import { useWikiPanelState } from "@/composable/useWikiOverview";

const { selectedId, searchKeyword, selectedLang, langOptions } = useWikiPanelState();
const props = defineProps<{
    marqueeRows: MarqueeRowType[];
    marqueeItems: MarqueeItemType[];
    data: T[];
}>();

const selectCount = computed(() => selectedId.value.size > 0 ? `已選 ${selectedId.value.size}` : 0);
const clickHandler = (id: string) => {
    if (selectedId.value.has(id)) {
        selectedId.value.delete(id);
    } else {
        selectedId.value.add(id);
    }
};
const clearClickHandler = () => {
    selectedId.value.clear();
};
</script>

<style lang="scss" scoped>
.wiki-overview {
    max-width: 100%;
    height: auto;
    min-height: 800px;
    background-color: var(--black-200);
    padding-top: 80px;

    .illustrated {
        width: 100%;
        height: auto;
        background-color: var(--black-200);
        overflow-x: scroll;
        overflow-y: hidden;
        transform: translateX(0px) translateY(10px);

        .scroll {
            display: flex;
            width: 200%;
        }
    }

    .illustrated::-webkit-scrollbar {
        display: none;
    }

    .information-container {
        width: 100%;
        height: auto;
        border-width: 10px;
        text-align: center;
    }

    .toolbar {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .content-area {
        width: 100%;
        height: auto;
    }
}

@keyframes animate {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(-100%);
    }
}

@keyframes animate2 {
    0% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(-200%);
    }
}
</style>
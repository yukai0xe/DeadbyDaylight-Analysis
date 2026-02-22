<template>
  <div class="perks flex justify-content-center align-items-center flex-column">
    <div v-if="!addOns.length">
      <img src="@/assets/picture/loading.gif" alt="loading">
    </div>
    <div class="illustrated">
      <div class="scroll">
        <Marquee
          :selected="selectedId"
          :rows="marqueeRows"
          :items="marqueeItems"
          @select="clickHandler"
        />
      </div>
    </div>

    <div class="infor flex justify-content-center align-items-center flex-column p-5">
      <h1>AddOns INFORMATION</h1>
      <hr class="outDialog">
      <div v-if="addOnsCount !== 0" class="my-5">
        <n-button class="mx-2" type="tertiary" @click="clearPerksClick">{{ addOnsCount }}</n-button>
        <n-button class="mx-2" type="tertiary" @click="clearPerksClick">Clear All</n-button>
      </div>
      <div class="nonePerks p-8" v-if="addOnsCount == 0">Please Click AddOns Above</div>
      <div
        class="inforBox flex justify-content-center align-items-center mb-5" 
        v-else 
        v-for="(addOns, index) in addOnsClick" 
        :key="index"
      >
       <AddOnsBox :addOns="addOns"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import Marquee from "@/components/marquee.vue";
import AddOnsBox from "@/components/addOnsBox.vue";
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import addOnsStore from "@/store/addOnsStore";
import { MarqueeRowType } from "@/types/components";
import type { AddOns } from "@/types/addOns";

const store = useStore();
const marqueeRows: MarqueeRowType[] = [
  { speed: "200s", reverse: false },
  { speed: "200s", reverse: true },
  { speed: "200s", reverse: false },
  { speed: "200s", reverse: true },
  { speed: "200s", reverse: false },
];
const addOns = computed<AddOns[]>(() => {
  return store.state.addOns?.fbAddOns ?? [];
});
const addOnsCount = computed(() => selectedId.value.size > 0 ? `已選 ${selectedId.value.size}` : 0);
const marqueeItems = computed(() => addOns.value.map(item => ({
  id: item.id,
  icon: item.icon,
  title: item.name,
})));
const selectedId = ref<Set<string>>(new Set());
const addOnsClick = computed(() => {
  return addOns.value.filter(addOns => selectedId.value.has(addOns.id));
});

const clickHandler = (id: string) => {
  if (selectedId.value.has(id)) {
    selectedId.value.delete(id);
  } else {
    selectedId.value.add(id);
  }
};

const clearPerksClick = () => {
  selectedId.value.clear();
};

onMounted(() => {
  if(!store.state.addOns) store.registerModule("addOns", addOnsStore);
  store.dispatch("addOns/GETDATA");
});
onBeforeUnmount(() => {
  store.unregisterModule("addOns")
});
</script>

<style lang="scss" scoped>
@import "../assets/scss/perks.scss";
</style>
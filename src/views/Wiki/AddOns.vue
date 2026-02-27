<template>
  <Overview
    :marquee-items="marqueeItems"
    :marquee-rows="marqueeRows"
    :data="addOns"
  >
    <template #toolbar>
      <div class="flex gap-4 items-center">
        <DropDown v-model="selectedCamp" :options="campOptions" placeholder="Select Camp" class="w-40" />
      </div>
    </template>
    <template #content>
      <div class="nonePerks p-8" v-if="selectedId.size === 0">Please Click AddOns Above</div>
      <div
        class="information-Box flex justify-content-center align-items-center mb-5"
        v-else
        v-for="(addOns, index) in addOnsClick"
        :key="index"
      >
        <AddOnsBox :addOns="addOns" />
      </div>
    </template>
  </Overview>
</template>

<script setup lang="ts">
import Overview from "./Overview.vue";
import AddOnsBox from "@/components/addOnsBox.vue";
import { ref, watch, onMounted, computed, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import addOnsStore from "@/store/addOnsStore";
import { MarqueeRowType, Option } from "@/types/components";
import type { AddOns } from "@/types/addOns";
import { provideWikiPanelState } from "@/composable/useWikiOverview";
import DropDown from "@/components/dropDown.vue";

const { selectedId, searchKeyword } = provideWikiPanelState();
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
const marqueeItems = computed(() => addOns.value.map(item => ({
  id: item.id,
  icon: item.icon,
  title: item.name,
})));
const filteredData = computed(() => {
  if (!searchKeyword.value) return addOns.value;
  return addOns.value.filter(d =>
    d.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});
const addOnsClick = computed(() => {
  return filteredData.value.filter(addOns => selectedId.value.has(addOns.id));
});
const selectedCamp = ref<number | null>(null);
const campOptions = computed<Option[]>(() => {
  const base: Option[] = [
    { label: "All", value: null, children: [] },
    { label: "Survivor Item", value: 1, children: [] },
    { label: "Killer Power", value: 2, children: [] },
  ];

  addOns.value.forEach(d => {
    const campOption = base.find(o => o.value === d.camp);
    if (campOption) {
      if (d.power.length > 0 && !campOption.children!.some(c => c.value === d.power)) {
        campOption.children!.push({
          label: d.power,
          value: d.power
        });
      }
    }
  });
  base.forEach(b => {
    if (b.children && b.children.length > 0) {
      b.children.sort((a, b) => a.label.localeCompare(b.label));
    }
  })
  return base;
});

watch((selectedCamp), (newSelectedCamp) => {
  if (typeof newSelectedCamp === 'string') {
    addOns.value.forEach(p => {
      if (p.power === newSelectedCamp) selectedId.value.add(p.id);
    })
  }
})

onMounted(() => {
  if(!store.state.addOns) store.registerModule("addOns", addOnsStore);
  store.dispatch("addOns/GETDATA");
});
onBeforeUnmount(() => {
  store.unregisterModule("addOns")
});
</script>

<style lang="scss" scoped>
.nonePerks {
  letter-spacing: 2px;
  font-size: 5vw;
  color: var(--gray-100);
  font-family: 'Carter One';
}

.information-Box {
  width: 100%;
  height: auto;
}
</style>
<template>
  <Overview
    :marquee-items="marqueeItems"
    :marquee-rows="marqueeRows"
    :data="perks"
  >
    <template #toolbar>
      <div class="flex gap-4 items-center">
        <DropDown
          v-model="selectedCamp"
          :options="campOptions"
          placeholder="Select Camp"
          class="w-40"
        />
      </div>
    </template>  
    <template #content>
      <div class="nonePerks p-8" v-if="selectedId.size === 0">Please Click Perks Above</div>
      <div 
        class="information-Box flex justify-content-center align-items-center mb-5"
        v-else
        v-for="(perk, index) in perksClick"
        :key="index"
      >
        <PerkBox :perk="perk" />
      </div>
    </template> 
  </Overview>
</template>

<script setup lang="ts">
import Overview from "./Overview.vue";
import PerkBox from "@/components/perkBox.vue";
import { watch, ref, onMounted, computed, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import perksStore from "@/store/perksStore";
import { Perk } from "@/types/perks";
import { MarqueeRowType, Option } from "@/types/components";
import { provideWikiPanelState } from "@/composable/useWikiOverview";
import DropDown from "@/components/dropDown.vue";

const marqueeRows: MarqueeRowType[] = [
  { speed: "100s", reverse: false },
  { speed: "100s", reverse: true },
  { speed: "100s", reverse: false },
  { speed: "100s", reverse: true },
  { speed: "100s", reverse: false },
];

const store = useStore();
const { selectedId, searchKeyword } = provideWikiPanelState();

const perks = computed<Perk[]>(() => {
  return store.state.perks?.fbPerks ?? [];
});
const filteredPerks = computed(() => {
  const filtered = perks.value.filter(perk => {
    const matchesCamp = (v: string | number | null) => {
      if (v === null) return true;
      if (typeof v === 'number') return perk.camp === v;
      if (typeof v === 'string') return perk.character === v;
    }
    const matchesSearch = !searchKeyword.value || perk.name.toLowerCase().includes(searchKeyword.value.toLowerCase());
    return matchesCamp(selectedCamp.value) && matchesSearch;
  });
  return filtered; 
});
const perksClick = computed(() => {
  return filteredPerks.value.filter(perk => selectedId.value.has(perk.id));
});
const marqueeItems = computed(() => perks.value.map(perk => ({
  id: perk.id,
  icon: perk.icon,
  title: perk.name,
})));
const selectedCamp = ref<number | null>(null);
const campOptions = computed<Option[]>(() => {
  const base: Option[] = [
    { label: "All", value: null, children: [] },
    { label: "Survivor", value: 1, children: [] },
    { label: "Killer", value: 2, children: [] },
  ];

  perks.value.forEach(perk => {
    const campOption = base.find(o => o.value === perk.camp);
    if (campOption) {
      if (perk.character.length > 0 && !campOption.children!.some(c => c.value === perk.character)) {
        campOption.children!.push({
          label: perk.character,
          value: perk.character
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
    perks.value.forEach(p => {
      if (p.character === newSelectedCamp) selectedId.value.add(p.id);
    })
  }
})

onMounted(() => {
  if(!store.state.perks) store.registerModule("perks", perksStore);
  store.dispatch("perks/GETDATA");
});
onBeforeUnmount(() => {
  store.unregisterModule("perks")
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
<template>
  <Overview
    :marquee-items="marqueeItems"
    :marquee-rows="marqueeRows"
    :data="perks"
  >
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
import { onMounted, computed, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import perksStore from "@/store/perksStore";
import { Perk } from "@/types/perks";
import { MarqueeRowType } from "@/types/components";
import { provideWikiPanelState } from "@/composable/useWikiOverview";

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
  if (!searchKeyword.value) return perks.value;
  return perks.value.filter(perk =>
    perk.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});
const perksClick = computed(() => {
  return filteredPerks.value.filter(perk => selectedId.value.has(perk.id));
});
const marqueeItems = computed(() => perks.value.map(perk => ({
  id: perk.id,
  icon: perk.icon,
  title: perk.name,
})));

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
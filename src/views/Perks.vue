<template>
  <div class="perks flex justify-content-center align-items-center flex-column">
    <div v-if="!perks.length">
      <img src="@/assets/picture/loading.gif" alt="loading">
    </div>
    <div class="illustrated">
      <div class="scroll">
        <Marquee
          :selected="selectedPerksId"
          :rows="marqueeRows"
          :items="marqueeItems"
          @select="clickPerk"
        />
      </div>
    </div>

    <div class="infor flex justify-content-center align-items-center flex-column p-5">
      <h1>Perks INFORMATION</h1>
      <hr class="outDialog">
      <div v-if="perksCount !== 0" class="my-5">
        <n-button class="mx-2" type="tertiary" @click="clearPerksClick">{{ perksCount }}</n-button>
        <n-button class="mx-2" type="tertiary" @click="clearPerksClick">Clear All</n-button>
      </div>
      <div class="nonePerks p-8" v-if="perksCount == 0">Please Click Perks Above</div>
      <div
        class="inforBox flex justify-content-center align-items-center mb-5" 
        v-else 
        v-for="(perk, index) in perksClick" 
        :key="index"
      >
       <PerkBox :perk="perk"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import Marquee from "@/components/marquee.vue";
import PerkBox from "@/components/perkBox.vue";
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import perksStore from "@/store/perksStore";
import { Perk } from "@/types/perks";
import { MarqueeRowType } from "@/types/components";

const store = useStore();
const marqueeRows: MarqueeRowType[] = [
  { speed: "100s", reverse: false },
  { speed: "100s", reverse: true },
  { speed: "100s", reverse: false },
  { speed: "100s", reverse: true },
  { speed: "100s", reverse: false },
];
const perks = computed<Perk[]>(() => {
  return store.state.perks?.fbPerks ?? [];
});
const perksCount = computed(() => selectedPerksId.value.size > 0 ? `已選 ${selectedPerksId.value.size}` : 0);
const marqueeItems = computed(() => perks.value.map(perk => ({
  id: perk.id,
  icon: perk.icon,
  title: perk.name,
})));
const selectedPerksId = ref<Set<string>>(new Set());
const perksClick = computed(() => {
  return perks.value.filter(perk => selectedPerksId.value.has(perk.id));
});

const clickPerk = (id: string) => {
  if (selectedPerksId.value.has(id)) {
    selectedPerksId.value.delete(id);
  } else {
    selectedPerksId.value.add(id);
  }
};

const clearPerksClick = () => {
  selectedPerksId.value.clear();
};

onMounted(() => {
  if(!store.state.perks) store.registerModule("perks", perksStore);
  store.dispatch("perks/GETDATA");
});
onBeforeUnmount(() => store.unregisterModule("perks"));
</script>

<style lang="scss" scoped>
@import "../assets/scss/perks.scss";
</style>
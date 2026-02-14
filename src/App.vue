<template>
  <n-config-provider :theme="darkTheme">
    <n-notification-provider>
      <div class="app">
        <component :is="layout">
          <router-view :key="store.state.character.data.character_id" />
        </component>
      </div>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { darkTheme, NConfigProvider, NNotificationProvider } from 'naive-ui'
import { computed, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import characterStore from "@/vuex/characterStore";
import "@/assets/scss/index.scss";

const route = useRoute()
const store = useStore();
const layoutMap = {
  default: DefaultLayout,
}
const layout = computed(() => {
  return layoutMap[route.meta.layout || 'default']
})
onBeforeMount(() => {
  if(!store.state.character) store.registerModule("character", characterStore);
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Source+Sans+Pro&family=Space+Grotesk&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Rowdies&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Ubuntu&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Quicksand&family=Ubuntu&display=swap");
@import url('https://fonts.googleapis.com/css2?family=Amaranth:ital,wght@1,700&family=Carter+One&family=Permanent+Marker&family=Rubik+Dirt&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Carter+One&family=Permanent+Marker&family=Rubik+Dirt&display=swap');
@import url('https://fonts.googleapis.com/earlyaccess/notosanstc.css');
@import url('https://fonts.googleapis.com/css2?family=Amaranth:ital,wght@1,700&family=Carter+One&family=Permanent+Marker&family=Rubik+Dirt&family=Rubik+Wet+Paint&display=swap');
</style>
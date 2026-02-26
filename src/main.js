import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./interceptors/axios";
import "swiper/swiper-bundle.css";
import store from "./store/store";
import VueCropper from "vue-cropper";
import axios from "axios";
import "@/assets/scss/index.scss";

import "vue-cropper/dist/index.css";
const app = createApp(App);

app.use(router).use(store).use(VueCropper)

app.config.globalProperties.$http = axios;

app.mount("#app");
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = "/";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkODVmYzNmZS0wNTkxLTQxMWMtYmU5Zi1hZTA1YWU2MjM3YTEiLCJpZCI6MjQwODAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODQ1MzA2NDd9._tjzJ8SuZAO2cIyCBHMNaU6vvnzgIw5MtkAE9T_V568";

createApp(App).use(store).use(router).mount("#app");

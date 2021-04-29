import { createRouter, createWebHashHistory } from "vue-router";
import Base from "../views/base.vue";
// demo
import CesiumDemo01 from "../views/demo01";

const routes = [
  {
    path: "/",
    name: "Base",
    component: Base,
  },
  {
    path: "/cesium-demo01",
    // path: "/",
    name: "CesiumDemo01",
    component: CesiumDemo01,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

<template>
  <div class="map-box">
    <div id="cesiumContainer" class="cesium-container"></div>
  </div>
</template>

<script>
import { Viewer, UrlTemplateImageryProvider } from "cesium";

export default {
  name: "CesiumEarth",
  components: {},
  mounted() {
    const vm = this;
    vm.init();
  },
  methods: {
    init() {
      const vm = this;
      const viewer = new Viewer("cesiumContainer", {
        // baseLayerPicker: false,
        // fullscreenButton: false,
        // geocoder: false,
        // homeButton: false,
        // navigationHelpButton: false,
        // sceneModePicker: false,
        // timeline: false,
        // animation: false,
        // imageryProvider: Cesium.UrlTemplateImageryProvider,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.map-box {
  width: 100%;
  height: 100%;
  .cesium-container {
    width: 100%;
    height: 100%;
  }
}
</style>

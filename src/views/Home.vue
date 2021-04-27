<template>
  <div class="map-box">
    <div id="cesiumContainer" class="cesium-container"></div>
  </div>
</template>

<script>
// import { Viewer, UrlTemplateImageryProvider } from "cesium";
import * as Cesium from "cesium";

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
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNWNlODhlNS1mN2Y4LTRkYTctYTlhZC0yNTdjMWJlNWE5ZjYiLCJpZCI6MjQwODAsImlhdCI6MTYxOTQ2MzU5MH0.dlg0s0ZugwP0jOSBzy0Rtoony0tUt8TSQLyNnb1IKjM";

      const viewer = new Cesium.Viewer("cesiumContainer", {
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

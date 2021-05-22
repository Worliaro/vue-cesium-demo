<template>
  <div class="map-box">
    <div id="cesiumContainer" class="cesium-container"></div>
    <div class="series-button-group">
      <div
        class="series-button"
        v-for="item in seriesButtonOptions"
        :key="item.id"
        @click="seriesChange(item.label)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script>
import WebGLGlobeDataSource from "./demo01";
import { Viewer } from "cesium";
export default {
  name: "CesiumDemo01",
  data: function () {
    return {
      // 接口获取到的数据
      dataSource: null,
    };
  },
  mounted() {
    const vm = this;
    vm.init();
  },
  methods: {
    init() {
      // get the website domain
      const protocol = window.location.protocol;
      const host = window.location.host;
      // const port = window.location.port;
      const domain = `${protocol}//${host}`;
      const reqApiFlag = "/sandcastle";
      //Now that we've defined our own DataSource, we can use it to load
      //any JSON data formatted for WebGL Globe.
      const vm = this;
      const dataSource = new WebGLGlobeDataSource();
      debugger;
      dataSource
        .loadUrl(domain + reqApiFlag + "/SampleData/population909500.json")
        .then(function () {
          debugger;
          vm.dataSource = dataSource;
        });
      //Create a Viewer instances and add the DataSource.
      var viewer = new Viewer("cesiumContainer", {
        animation: false,
        timeline: false,
      });
      viewer.clock.shouldAnimate = false;
      viewer.dataSources.add(dataSource);
    },
    /**
     * 切换series
     */
    seriesChange(seriesName) {
      const vm = this;
      debugger;
      vm.dataSource.seriesToDisplay = seriesName;
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

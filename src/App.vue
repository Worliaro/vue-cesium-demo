<template>
  <div style="width: 100%; height: 100%">
    <div class="route-style">
      <router-link to="/" exact>base</router-link>
    </div>
    <div class="route-style">
      <router-link to="/cesium-demo01" exact>demo01</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}
#app {
  text-align: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.route-style {
  font-size: 16px;
}
</style>

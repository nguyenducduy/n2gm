<template>
  <el-container>
    <el-header>
      <navigation></navigation>
    </el-header>
    <nuxt/>
  </el-container>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import Navigation from '@/components/admin/Navigation.vue'

@Component({
  components: {
    Navigation
  }
})
export default class DefaultLayout extends Vue {}
</script>

<style lang="scss">
@import '../assets/_reset';
@import '../assets/transition';
@import '../assets/element-ui-font-awesome';

body {
  font-family: Arial;
  font-size: 14px;
}
.el-header,
.el-footer {
  height: 46px !important;
  padding: 0;
  color: #333;
  text-align: left;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: left;
  line-height: 200px;
  width: 220px;
}

.el-main {
  background-color: #fff;
  color: #333;
  text-align: left;
  padding: 0;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.container {
  min-height: 100vh;

  .topbar {
    background-color: #ecf0f1;
    height: 50px;
    padding: 17px;
  }

  .breadcrumb-container {
    [class^="el-icon-fa"], [class*=" el-icon-fa"] {
      display: inline-block;
      font: normal normal normal 18px/1 FontAwesome !important;
    }
  }

  .pagination-container {
    text-align: right;
    height: 50px;
    background-color: #ecf0f1;
    margin-top: -17px;
  }
}
</style>

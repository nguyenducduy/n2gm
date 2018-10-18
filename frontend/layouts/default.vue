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

  .el-button,
  .el-input__inner,
  .el-input-group__append,
  .el-input-group__prepend {
    border-radius: 2px !important;
  }

  .el-input-group--append .el-input__inner,
  .el-input-group__prepend {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  .el-input-group--prepend .el-input__inner,
  .el-input-group__append {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
}
.el-header,
.el-footer {
  height: 46px !important;
  padding: 0;
  color: #333;
  text-align: left;
  position: fixed;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.el-aside {
  color: #333;
  text-align: left;
  width: 220px !important;
  border-right: solid 1px #e6e6e6;
  margin-top: 46px;

  &.filter-container {
    padding: 12px 17px 0 17px;
    .el-form {
      .el-select {
        width: 100% !important;
      }
      .el-form-item__label {
        line-height: 0px;
      }
    }
  }
}

.el-main {
  margin-top: 46px;
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

    .right {
      margin-top: -12px;
      float: right;
      display: block;
    }
  }

  .breadcrumb-container {
    [class^="el-icon-fa"], [class*=" el-icon-fa"] {
      display: inline-block;
      font: normal normal normal 16px/1 FontAwesome !important;
      margin-left: 6px;
      margin-right: 6px;
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

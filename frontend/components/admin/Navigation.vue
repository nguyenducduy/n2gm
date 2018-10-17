<template>
  <el-menu
    mode="horizontal"
    unique-opened
    :default-active="$route.path"
    router>
    <el-menu-item index="/">
      <!-- <img src="/img/logo.png" width="25" height="20" /> -->
    </el-menu-item>
    <el-menu-item index="/admin/dashboard">
      {{ $t('default.list') }}
    </el-menu-item>
    <el-menu-item index="/admin/users">
      {{ $t('default.user') }}
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Navigation extends Vue {}
</script>

<style lang="scss" scoped>
.el-menu--horizontal {
  height: 45px;

  .el-menu-item {
    height: 45px;
    line-height: 45px;
  }

  .el-submenu {
    .el-menu {
      top: 50px;
    }
    .el-submenu__title {
      height: 45px;
      line-height: 45px;
    }
  }
  .avatar-container {
    height: 43px;
    display: inline-block;
    float: right;
    margin-right: 40px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 7px;
      position: relative;
      float: left;
      clear: both;

      .user-name {
        float: left;
        padding-top: 7px;
        padding-right: 10px;
      }
      .user-avatar {
        width: 30px;
        height: 30px;
        border-radius: 15px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 10px;
        font-size: 12px;
      }
    }
  }
}
</style>

<template>
  <el-menu
    mode="horizontal"
    unique-opened
    :default-active="$route.path"
    router>
    <el-menu-item index="/"></el-menu-item>
    <el-menu-item index="/admin/dashboard">
      {{ $t('default.dashboard') }}
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

export default class Navigation extends Vue {

}
</script>

<style lang="scss" scoped>
</style>

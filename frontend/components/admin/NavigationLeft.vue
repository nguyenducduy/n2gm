<template>
  <div class="navmenu" ref="sticky" :style="myStyle">
    <el-menu
      class="el-menu-vertical-demo"
      unique-opened
      :default-active="$route.path"
      router
      collapse>
      <el-menu-item index="/admin/dashboard">
        <i class="el-icon-menu"></i>
        <span slot="title">Dashboard</span>
      </el-menu-item>
      <el-submenu index="/admin/user" :show-timeout="0" :hide-timeout="0">
        <template slot="title">
          <i class="el-icon-fa-users"></i>
          <span slot="title">{{ $t('navigation.users') }}</span>
        </template>
        <el-menu-item index="/admin/user">
          <i class="el-icon-fa-navicon"></i>
          {{ $t('default.list') }}
        </el-menu-item>
        <el-menu-item index="/admin/user/create">
          <i class="el-icon-fa-plus"></i>
          {{ $t('default.create') }}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator';

@Component
export default class NavigationLeft extends Vue {
  @Watch('scrollY')
  onScroll(newValue) {
    const rect = this.$refs.sticky.getBoundingClientRect();
    const newTop = this.scrollY - this.originalTop;

    if (newTop > 0) {
      this.$set(this.myStyle, 'top', `0px`);
    } else {
      this.$delete(this.myStyle, 'top');
    }
  }

  scrollY = null;
  myStyle = {};
  originalTop = 0;

  $refs: {
    sticky: HTMLFormElement
  }

  mounted() {
    this.originalTop = this.$refs.sticky.getBoundingClientRect().top;

    window.addEventListener('scroll', (event) => {
      this.scrollY = Math.round(window.scrollY);
    })
  }
}
</script>

<style lang="scss" scoped>
.navmenu {
  position: fixed;
  top: 46px;
  bottom: 0;
  background-color: whitesmoke;
  width: 64px;
  z-index: 100;

  .el-menu {
    min-height: 100%;

    .is-active {
      border-right: 2px solid #54a0ff;
    }
  }
}
</style>

<template>
  <el-container>
    <el-header>
      <navigation-top></navigation-top>
    </el-header>
    <navigation-left></navigation-left>
    <nuxt/>
  </el-container>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import NavigationTop from '@/components/admin/NavigationTop.vue'
import NavigationLeft from '@/components/admin/NavigationLeft.vue'

@Component({
  components: {
    NavigationTop,
    NavigationLeft
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
  .el-tag,
  .el-input__inner,
  .el-input-group__append,
  .el-input-group__prepend {
    border-radius: 2px;
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
  background-color: #fff;
  color: #333;
  text-align: left;
  z-index: 1000;
  width: 100%;
  border-bottom: 1px solid #e6e6e6;

  .el-menu--horizontal {
    border: none;
  }
}

.el-aside {
  color: #333;
  background-color: rgba(84, 160, 255, 0.05);
  text-align: left;
  width: 220px !important;
  border-right: solid 1px #e6e6e6;
  margin-left: 64px;

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

  .panel-body {
    margin: 17px;
  }

  .topbar {
    background-color: #54a0ff;
    height: 50px;
    padding: 17px;

    .app-breadcrumb {
      float: left;

      .add-btn-form .el-button--text,
      a,
      i {
        color: #fff;
      }
      
    }
  }

  .breadcrumb-container {
    [class^="el-icon-fa"], [class*=" el-icon-fa"] {
      display: inline-block;
      font: normal normal normal 16px/1 FontAwesome !important;
      margin-left: 6px;
      margin-right: 6px;
    }

    .total-items {
      float: left;
      margin-left: 3px;
      font-size: 16px;
      color: #fff;
    }
  }

  .pagination-container {
    text-align: right;
    height: 50px;
    margin-top: -17px;
    .add-btn-form {
      display: inline-block;
      margin-right: 16px;
      margin-top: 5px;

      .el-dialog {
        text-align: left;
      }
    }
  }

  .pagination-bottom {
    margin-right: 17px;
    display: inline-block;
    float: right;
    margin-top: -60px;
  }
}
</style>

<template>
  <el-row>
    <el-col :md="18">
      <img class="logo" src="/logo-transparent.png"/>
    </el-col>
    <el-col :md="6">
      <el-dropdown class="avatar-container" v-if="loggedUser" @command="onUserSelect">
        <span class="el-dropdown-link">
          <div class="avatar-wrapper">
            <span class="user-name">
              {{ loggedUser.fullName }}
            </span>
            <img v-if="loggedUser.avatar !== ''" :src="loggedUser.avatar" width="30" height="30" class="user-avatar">
            <img v-else src="/avatar-default.png" width="30" height="30" class="user-avatar">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
        </span>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <el-dropdown-item command="/admin/user/changepassword">
            {{ $t('default.changePassword') }}
          </el-dropdown-item>
          <el-dropdown-item command="/admin/logout" divided>
            <span style="display:block;">{{ $t('default.logout') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="locale-container">
        <el-dropdown @command="changeLocale">
          <span class="el-dropdown-link">
            <span v-if="$i18n.locale === 'vi'">
              <span class="flag-icon flag-icon-vn"></span> Tiếng Việt
            </span>
            <span v-else>
              <span class="flag-icon flag-icon-us"></span> English
            </span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="en">
              <span class="flag-icon flag-icon-us"></span> English
            </el-dropdown-item>
            <el-dropdown-item command="vi">
              <span class="flag-icon flag-icon-vn"></span> Tiếng Việt
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { Getter } from 'vuex-class';

@Component
export default class NavigationTop extends Vue {
  @Getter loggedUser;

  onUserSelect(path) {
    return this.$router.push({ path: path });
  }

  changeLocale(locale) {
    // setLocale(locale)
    // return window.location.reload()
  }

}
</script>

<style lang="scss" scoped>
 img.logo {
    width: 45px;
    height: 45px;
    margin-left: 10px;
  }
  .avatar-container {
    float: right;
    margin-top: 7px;
    margin-right: 17px;

    &:focus  {
      outline: none;
    }
  }

  .avatar-wrapper
  {
    display: -webkit-flex;
    display: flex;
    cursor: pointer;
    .user-name {
      margin: 0 6px;
      line-height: 30px;
    }
    .el-icon-arrow-down {
      line-height: 30px;
    }
    img {
      border-radius: 30px;
    }
  }

  .locale-container {
    cursor: pointer;
    float: right;
    margin-left: 15px;
    margin-right: 15px;
    margin-top: 14px;
    font-size: 14px;
    border-right: 1px solid #ecf0f1;
    padding-right: 15px;
  }
</style>

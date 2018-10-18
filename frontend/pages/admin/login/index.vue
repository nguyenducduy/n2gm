<template>
  <section class="login-container">
     <div class="page-content">
      <div class="panel">
        <div class="panel-body">
          <div class="brand">
            <img class="brand-img" src="/img/logo.png" width="100">
            <h2 class="brand-text font-size-18">{{ $t('title') }}</h2>
          </div>
          <el-form
            autoComplete="on"
            label-position="left"
            label-width="0px"
            class="login-form"
            :model="loginForm"
            ref="loginForm">
            <el-form-item prop="email" :rules="[
              { required: true, message: $t('msg.emailIsRequired'), trigger: 'blur' },
              { type: 'email', message: $t('msg.emailInvalid'), trigger: 'blur,change' }
            ]">
              <el-input
                tabindex="1"
                prefix-icon="el-icon-fa-envelope"
                name="email"
                type="text"
                autoComplete="on"
                :placeholder="$t('label.email')"
                v-model.trim="loginForm.email"
                autofocus />
              </el-input>
            </el-form-item>
            <el-form-item prop="password" :rules="[
                { required: true, message: this.$t('msg.passwordIsRequired'), trigger: 'blur' }
            ]">
              <el-input
                tabindex="2"
                prefix-icon="el-icon-fa-key"
                name="password"
                type="password"
                :placeholder="$t('label.password')"
                v-model="loginForm.password"
                @keyup.enter.native="handleLogin" />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="width:100%;"
                :loading="loading"
                @click.native.prevent="handleLogin">
                {{ $t('label.login') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { Action } from 'vuex-class';

@Component({
  layout: 'blank',
  notifications: {
    loginError: {
      icon: 'fas fa-exclamation-triangle',
      position: 'bottomCenter',
      title: 'Login failed',
      toastOnce: true,
      type: 'error'
    }
  }
})
export default class AdminLoginPage extends Vue {
  @Action('users/login_by_username') loginAction;

  loading = false;
  loginForm = {
    email: null,
    password: null
  };

  $refs: {
    loginForm: HTMLFormElement
  }

  loginError: ({ message: string }) => void;

  head() {
    return {
      title: this.$t('title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('title')
        }
      ]
    };
  }

  handleLogin() {
    this.$refs.loginForm.validate(async valid => {
      if (valid) {
        this.loading = true;
        const errors = await this.loginAction(this.loginForm);
        this.loading = false;

        if (typeof errors !== 'undefined') {
          errors.map(err => {
            this.loginError({message: err.message});
          })

          return;
        }

        let redirectUrl = '/';
        if (typeof this.$route.query.redirect !== 'undefined') {
          redirectUrl = Buffer.from(this.$route.query.redirect, 'base64').toString('ascii');
        }

        return this.$router.push({
          path: redirectUrl
        });
      } else {
        return false;
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/_mixin';

.login-container {
  width: 100%;
  height: 100vh;
  font-weight: 100;
  background: #3949ab;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJod…EiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);
  background-image: -webkit-linear-gradient(top, #3949ab 0%, #283593 100%);
  background-image: -o-linear-gradient(top, #3949ab 0%, #283593 100%);
  background-image: -webkit-gradient(linear, left top, left bottom, from(#3949ab), to(#283593));
  background-image: linear-gradient(to bottom, #3949ab 0%, #283593 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff3949ab', endColorstr='#ff283593', GradientType=0);
  background-repeat: repeat-x;
  background-position: center top;
  -webkit-background-size: cover;
  background-size: cover;

  .page-content {
    @include vertical-align();
    padding: 30px;
    text-align: center;

    .panel {
      width: 400px;
      margin-bottom: 45px;
      background: #fff;
      border-radius: 4px;
      display: inline-block;
      vertical-align: middle;

      .panel-body {
        padding: 50px 40px 40px;
        margin-left: 0 !important;
        min-height: 100%;
        max-height: 100%;

        .brand-text {
          font-size: 18px!important;
          font-weight: 400;
          text-shadow: rgba(0,0,0,.15) 0 0 1px;
        }
        .login-form {
          margin: 45px 0 30px;

          .el-form-item {
            margin-bottom: 22px;
          }
        }
      }
    }
  }
}
</style>

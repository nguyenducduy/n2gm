<template>
  <section class="login-container">
     <div class="page-content">
      <div class="panel">
        <div class="panel-body">
          <div class="brand">
            <img class="brand-img" src="/img/logo.png" width="100">
            <h2 class="brand-text font-size-18">{{ $t('title') }}</h2>
          </div>
          <el-form autoComplete="on" label-position="left" label-width="0px" class="login-form" :model="loginForm" ref="loginForm">
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
              <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
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

@Component
export default class AdminLoginPage extends Vue {
  loading = false;
  loginForm = {
    email: null,
    password: null
  };

  $refs: {
    loginForm: HTMLFormElement
  }

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

  }
}
</script>
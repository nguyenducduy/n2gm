<template>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-container>
      <el-main>
        <section class="container">
          <div>
            <h1 class="title">
              {{ $t('default.changePassword') }}
            </h1>
            <h2 class="subtitle">
              {{ $t('description') }}
            </h2>
            <div class="links">
              <a
                href="https://nuxtjs.org/"
                target="_blank"
                class="button--green">Documentation</a>
              <a
                href="https://github.com/nuxt/nuxt.js"
                target="_blank"
                class="button--grey">GitHub</a>
            </div>
          </div>
        </section>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class IndexPage extends Vue {

}
</script>

<style>
</style>

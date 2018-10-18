<template>
  <section class="login-container">
    <h1>Internal Server Error</h1>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component({
  layout: 'blank'
})
export default class InternalServerErrorPage extends Vue {}
</script>

<template>
  <nuxt/>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class BlankLayout extends Vue {}
</script>

<style lang="scss">
@import '../assets/_reset';
@import '../assets/element-ui-font-awesome';

body {
  font-family: Arial;
  font-size: 1em;
}
</style>

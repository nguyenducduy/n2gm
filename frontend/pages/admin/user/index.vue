<template>
  <el-container>
    <el-aside>Aside</el-aside>
    <el-container>
      <el-main>
        <section class="container">
          <el-row class="topbar">
            <el-col :md="18" class="breadcrumb-container">
              <i class="el-icon-fa-users"></i>
              <breadcrumb />
            </el-col>
            <el-col :md="6" class="pagination-container">
              <pagination
                :totalItems="1"
                :currentPage="1"
                :recordPerPage="30" />
            </el-col>
          </el-row>
        </section>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import Breadcrumb from '~/components/admin/Breadcrumb.vue';
import Pagination from '~/components/admin/Pagination.vue';

@Component({
  components: {
    Breadcrumb,
    Pagination
  }
  // middleware: ['authenticated']
})
export default class UserIndexPage extends Vue {

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
}
</script>

<style>
</style>

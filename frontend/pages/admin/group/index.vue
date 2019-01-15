<template>
  <el-container>
    <el-aside class="filter-container">
      <el-form label-position="top" size="small">
        <el-form-item>
          <el-input :placeholder="$t('pages.admin.group.form.search')"
            v-model="form.q"
            @keyup.enter.native="onFilter"
            suffix-icon="el-icon-search"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onFilter">{{ $t('default.filter') }}</el-button>
          <el-button @click="onReset">{{ $t('default.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </el-aside>
    <el-container>
      <el-main>
        <section class="container">
          <el-row class="topbar">
            <el-col :md="14" class="breadcrumb-container">
              <breadcrumb />
              <span class="total-items">({{ totalItems }})</span>
            </el-col>
            <el-col :md="10" class="pagination-container">
              <manage-permission-form class="add-btn-form"/>
              <add-group-form class="add-btn-form"/>
            </el-col>
          </el-row>
          <el-row class="table-view">
            <el-col :md="24">
              <div class="panel-body">
                <group-items
                  :loadingState="pageLoading"
                  @setLoading="setLoading"
                  @unsetLoading="unsetLoading"
                  @reload="initData">
                </group-items>
              </div>
            </el-col>
          </el-row>
        </section>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator';
import { Action, State } from 'vuex-class';
import Breadcrumb from '~/components/admin/Breadcrumb.vue';
import Pagination from '~/components/admin/Pagination.vue';
import AddGroupForm from '~/components/admin/group/AddGroupForm.vue';
import ManagePermissionForm from '~/components/admin/group/ManagePermissionForm.vue';
import GroupItems from '~/components/admin/group/Items.vue';
const querystring = require('querystring');

@Component({
  components: {
    Breadcrumb,
    Pagination,
    AddGroupForm,
    ManagePermissionForm,
    GroupItems
  }
})
export default class GroupIndexPage extends Vue {
  @Action('groups/get_all') getAllAction;
  @State(state => state.groups.data) groups;
  @State(state => state.groups.query) query;
  @State(state => state.groups.totalItems) totalItems;
  @State(state => state.groups.recordPerPage) recordPerPage;
  @Watch('$route')
  onPageChange() { this.initData() }

  pageLoading: boolean = false;
  form: any = {};

  head() {
    return {
      title: this.$t('pages.admin.group.title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.admin.group.title')
        }
      ]
    };
  }

  onFilter() {
    this.query.page = 1;
    const pageUrl = `?${querystring.stringify(
      this.form
    )}&${querystring.stringify(this.query)}`;

    return this.$router.push(pageUrl);
  }

  onReset() {
    return this.$router.push('/admin/group');
  }

  setLoading() {
    this.pageLoading = true;
  }

  unsetLoading() {
    this.pageLoading = false;
  }

  mounted() {
    this.initData();
  }

  async initData() {
    this.pageLoading = true;

    await this.getAllAction({ query: this.$route.query });

    this.form = {
      q: this.$route.query.q || '',
      status: parseInt(this.$route.query.status) || null
    };

    this.pageLoading = false;
  }
}
</script>

<style scoped>
.container .pagination-bottom {
  margin-top: 0;
}
</style>

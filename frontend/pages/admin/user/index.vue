<template>
  <el-container>
    <el-aside class="filter-container">
      <el-form label-position="top" size="small">
        <el-form-item prop="keyword">
          <el-input :placeholder="$t('form.search')"
            v-model="form.keyword"
            @keyup.enter.native="onFilter"
            suffix-icon="el-icon-search"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="groups" :label="$t('form.group')">
          <el-select multiple v-model="form.groups" :placeholder="$t('default.all')">
            <el-option
              v-for="item in formSource.groups"
              :key="item.id" :label="item.screenName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" :label="$t('form.status')">
          <el-select clearable v-model="form.status" :placeholder="$t('default.all')">
            <el-option
              v-for="item in formSource.status"
              :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
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
              <add-group-form class="add-btn-form"/>
              <add-user-form class="add-btn-form"/>
              <pagination
                :totalItems="totalItems"
                :currentPage="query.page"
                :recordPerPage="recordPerPage" />
            </el-col>
          </el-row>
          <el-row class="table-view">
            <el-col :md="24">
              <div class="panel-body">
                <user-items :loadingState="pageLoading"></user-items>
              </div>
              <div class="pagination-bottom">
                <pagination
                  :totalItems="totalItems"
                  :currentPage="query.page"
                  :recordPerPage="recordPerPage" />
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
import AddUserForm from '~/components/admin/user/AddUserForm.vue';
import AddGroupForm from '~/components/admin/user/AddGroupForm.vue';
import UserItems from '~/components/admin/user/Items.vue';
const querystring = require('querystring');

@Component({
  components: {
    Breadcrumb,
    Pagination,
    AddUserForm,
    AddGroupForm,
    UserItems
  }
  // middleware: ['authenticated']
})
export default class UserIndexPage extends Vue {
  @Action('users/get_form_source') getFormsourceAction;
  @Action('users/get_all') getAllAction;
  @State(state => state.users.data) users;
  @State(state => state.users.query) query;
  @State(state => state.users.formSource) formSource;
  @State(state => state.users.totalItems) totalItems;
  @State(state => state.users.recordPerPage) recordPerPage;
  @Watch('$route')
  onPageChange() { this.initData() }

  pageLoading = false;

  form: any = {
    keyword: '',
    groups: []
  };

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

  onFilter() {
    this.query.page = 1;
    const pageUrl = `?${querystring.stringify(
      this.form
    )}&${querystring.stringify(this.query)}`;

    return this.$router.push(pageUrl);
  }

  onReset() {
    return this.$router.push('/admin/user');
  }

  mounted() {
    this.initData();
  }

  async initData() {
    this.pageLoading = true;

    await this.getFormsourceAction();
    await this.getAllAction({ query: this.$route.query });

    this.form = {
      keyword: this.$route.query.keyword || '',
      groups: this.$route.query.groups || []
    };

    this.pageLoading = false;
  }
}
</script>


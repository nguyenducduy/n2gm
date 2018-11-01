<template>
  <el-container>
    <el-aside class="filter-container">
      <el-form label-position="top" size="small">
        <el-form-item>
          <el-input :placeholder="$t('pages.admin.user.form.search')"
            v-model="form.q"
            @keyup.enter.native="onFilter"
            suffix-icon="el-icon-search"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('pages.admin.user.form.group')">
          <el-select multiple v-model="form.groups" :placeholder="$t('default.all')">
            <el-option
              v-for="item in formSource.groups"
              :key="item.id" :label="item.screenName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('pages.admin.user.form.status')">
          <el-select clearable v-model="form.status" :placeholder="$t('default.all')" class="is-focus">
            <el-option
              v-for="item in formSource.status"
              :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('pages.admin.user.form.verifyType')">
          <el-select clearable v-model="form.verifyType" :placeholder="$t('default.all')">
            <el-option
              v-for="item in formSource.verifyTypes"
              :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="form.isSuperUser"
            :active-value="1"
            :inactive-value-value="3"
            :active-text="$t('pages.admin.user.form.isSuperUser')">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="form.isStaff"
            :active-value="1"
            :inactive-value-value="3"
            :active-text="$t('pages.admin.user.form.isStaff')">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="form.isVerified"
            :active-value="1"
            :inactive-value-value="3"
            :active-text="$t('pages.admin.user.form.isVerified')">
          </el-switch>
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
                <user-items
                  :loadingState="pageLoading"
                  @setLoading="setLoading"
                  @unsetLoading="unsetLoading"
                  @reload="initData">
                </user-items>
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
  },
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

  pageLoading: boolean = false;
  form: any = {};

  head() {
    return {
      title: this.$t('pages.admin.user.title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.admin.user.title')
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

    await this.getFormsourceAction();
    await this.getAllAction({ query: this.$route.query });

    this.form = {
      q: this.$route.query.q || '',
      status: parseInt(this.$route.query.status) || null,
      verifyType: parseInt(this.$route.query.verifyType) || null,
      groups: [],
      isSuperUser: parseInt(this.$route.query.isSuperUser) || null,
      isStaff: parseInt(this.$route.query.isStaff) || null,
      isVerified: parseInt(this.$route.query.isVerified) || null
    };

    // map groups because it's multiple selected
    if (typeof this.$route.query.groups !== 'undefined'
      && this.$route.query.groups.length > 1) {
      const myGroups: any = this.$route.query.groups;
      this.form['groups'] = myGroups.map(g => parseInt(g));
    } else if (typeof this.$route.query.groups !== 'undefined') {
      this.form['groups'] = [parseInt(this.$route.query.groups)];
    } else {
      this.form['groups'] = [];
    }

    this.pageLoading = false;
  }
}
</script>


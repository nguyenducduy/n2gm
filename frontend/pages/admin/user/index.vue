<template>
  <el-container>
    <el-aside class="filter-container">
      <el-form label-position="top">
        <el-form-item prop="keyword">
          <el-input size="small" :placeholder="$t('form.search')"
            v-model="form.keyword"

            clearable>
            <el-button slot="append" ><i class="el-icon-fa-search"></i></el-button>
          </el-input>
        </el-form-item>
        <!-- <el-form-item prop="groupid" :label="$t('form.group')">
          <el-select clearable size="small" v-model="form.groupid" :placeholder="$t('default.all')">
            <el-option v-for="item, index in formSource.groupList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" :label="$t('form.status')">
          <el-select clearable size="small" v-model="form.status" :placeholder="$t('default.all')">
            <el-option v-for="item in formSource.statusList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="verifytype" :label="$t('form.verifyType')">
          <el-select clearable size="small" v-model="form.verifytype" :placeholder="$t('default.all')">
            <el-option v-for="item in formSource.verifyList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" size="small" >{{ $t('default.filter') }}</el-button>
          <el-button size="small" >{{ $t('default.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </el-aside>
    
    <el-container>
      <el-main>
        <section class="container">
          <el-row class="topbar">
            <el-col :md="18" class="breadcrumb-container">
              <i class="el-icon-fa-users"></i>
              <breadcrumb />
              <div class="right">
                <add-user-form />
              </div>
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
import { Vue, Component, Watch } from 'nuxt-property-decorator';
import { Action, State } from 'vuex-class';
import Breadcrumb from '~/components/admin/Breadcrumb.vue';
import Pagination from '~/components/admin/Pagination.vue';
import AddUserForm from '~/components/admin/user/AddUserForm.vue';

@Component({
  components: {
    Breadcrumb,
    Pagination,
    AddUserForm
  }
  // middleware: ['authenticated']
})
export default class UserIndexPage extends Vue {
  @State(state => state.users.query) query;
  @State(state => state.users.formSource) formSource;
  @Watch('$route')
  onPageChange() { this.initData() }

  form = {};

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

  async initData() {
    this.form = {
      keyword: this.$route.query.keyword || ''
    };
  }
}
</script>

<style>
</style>

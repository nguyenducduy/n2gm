<template>
  <div>
    <el-button
      type="text"
      icon="el-icon-tickets"
      @click="visible = true">
      {{ $t('pages.admin.group.label.managePermission') }}
    </el-button>
    <el-dialog
      ref="dialog"
      :visible.sync="visible"
      v-on:close="onClose"
      v-on:open="onOpen"
      top="0"
      close-on-press-escape
      lock-scroll
      width="35%">
      <template slot="title">
        <h3>
          {{ $t('pages.admin.group.label.managePermission') }}
          ({{ totalItems }})
        </h3>
      </template>
      <el-row>
        <el-col :md="24">
          <add-permission-form></add-permission-form>
        </el-col>
        <el-col :md="24">
          <el-input
            style="margin-top: 16px; margin-bottom: 16px;"
            type="text"
            v-model="searchTerm"
            placeholder="Search"
            size="small" />
          <el-table
            size="mini"
            v-loading.fullscreen.lock="pageLoading"
            :data="permissions.filter(data => !searchTerm || data.name.toLowerCase().includes(searchTerm.toLowerCase()))">
            <el-table-column
              :label="$t('pages.admin.group.form.permissionName')">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('pages.admin.group.form.permissionDescription')">
              <template slot-scope="scope">
                {{ scope.row.description }}
              </template>
            </el-table-column>
            <el-table-column class-name="td-operation" width="70" align="right">
              <template slot-scope="scope">
                <del-button :id="scope.row.id" store="permissions"></del-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { Action, State } from 'vuex-class';
import DelButton from '~/components/admin/DelButton.vue';
import AddPermissionForm from '~/components/admin/group/AddPermissionForm.vue';

@Component({
  components: {
    DelButton,
    AddPermissionForm
  }
})
export default class ManagePermissionForm extends Vue {
  @Action('permissions/get_all') getAllAction;
  @State(state => state.permissions.data) permissions;
  @State(state => state.permissions.totalItems) totalItems;
  @State(state => state.permissions.recordPerPage) recordPerPage;
  @State(state => state.permissions.page) page;

  visible: boolean = false;
  pageLoading: boolean = false;
  searchTerm: string = '';

  onClose() {
    this.visible = false;
  }

  async onOpen() {
    this.pageLoading = true;
    await this.loadData(1);
    this.pageLoading = false;
  }

  async loadData(page) {
    await this.getAllAction({ query: {} });
  }
}
</script>


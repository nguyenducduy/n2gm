<template>
  <div style="display: inline-block; float: left; clear: both;">
    <el-tooltip
      class="item"
      effect="dark"
      :content="$t('pages.admin.group.label.assignPermissionTo').replace('###groupName###', groupName)"
      placement="top-start">
      <el-button type="text" icon="el-icon-plus" @click="visible = true">
      </el-button>
    </el-tooltip>
    <el-dialog
      ref="dialog"
      :visible.sync="visible"
      v-on:close="onClose"
      v-on:open="onOpen"
      top="0"
      close-on-press-escape
      lock-scroll
      width="25%">
      <template slot="title">
        <h3>{{ $t('pages.admin.group.label.assignPermission') }}</h3>
      </template>
      <el-row>
        <el-input
          style="margin-top: 16px; margin-bottom: 16px;width: 67%;"
          type="text"
          v-model="searchTerm"
          placeholder="Search"
          size="small"/>
        <el-checkbox
          style="width: 30%; float: left; margin-top: 20px; margin-left: 10px;"
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="onCheckAllChange">
          Check all
        </el-checkbox>
        <el-checkbox-group
          v-model="checkedPermissions"
          @change="onCheckedChange">
          <el-table :data="permissions.filter(data => !searchTerm || data.name.toLowerCase().includes(searchTerm.toLowerCase()))" size="mini">
            <el-table-column>
              <template slot-scope="scope">
                <el-tag size="mini">
                  <el-checkbox
                    :label="scope.row.id" :key="scope.row.id">
                    {{ scope.row.name }}
                  </el-checkbox>
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description">
            </el-table-column>
          </el-table>
        </el-checkbox-group>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { Action, State } from 'vuex-class';

@Component
export default class AssignPermission extends Vue {
  @Prop() groupId: number;
  @Prop() groupName: string;
  @Action('permissions/get_all') getAllAction;
  @Action('permissions/assign') assignAction;
  @State(state => state.permissions.data) permissions;

  visible: boolean = false;
  loading: boolean = false;
  checkAll: boolean = false;
  checkedPermissions: any = [];
  isIndeterminate: boolean = true;
  searchTerm: string = '';

  onCheckAllChange(val) {
    this.checkedPermissions = val ? this.permissions.map(data => data.id) : [];
    this.isIndeterminate = false;
  }

  onCheckedChange(value) {
    let checkedCount = value.length;
    this.checkAll = checkedCount === this.permissions.length;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.permissions.length;

    this.assignAction({
      id: this.groupId,
      input: value
    });
  }

  onClose() {
    this.visible = false;
  }

  async onOpen() {
    await this.loadData(1);
  }

  async loadData(page) {
    await this.getAllAction({ query: {} });
  }
}
</script>

<style scoped>
.el-dialog {
  text-align: left;
}
</style>

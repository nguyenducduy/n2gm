<template>
  <section>
    <el-table
      ref="bulkSelected"
      :data="groups"
      style="width: 100%"
      v-loading.fullscreen.lock="loadingState"
      row-key="id"
      :expand-row-keys="[1]">
      <el-table-column>
        <template slot-scope="scope">
          <el-table
            size="mini"
            row-key="id"
            :data="scope.row.permissions"
            border
            stripe>
            <el-table-column
              :label="$t('pages.admin.group.label.permissionName')">
              <template slot-scope="props">
                <el-tag size="mini">{{ props.row.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('pages.admin.group.label.permissionDescription')">
              <template slot-scope="props">
                {{ props.row.description }}
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="props">
                <el-button
                  size="mini"
                  type="danger"
                  @click="onUnsignPerm(props.$index, props.row)">
                  {{ $t('pages.admin.group.label.permissionDetach') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('pages.admin.group.label.name')"
        width="300">
        <template slot-scope="scope">
          <strong>{{ scope.row.screenName }}</strong>
          <small>{{ scope.row.name }}</small>
          <br/>
          <el-input placeholder="Search perm" size="small"/>
        </template>
      </el-table-column>
      <el-table-column class-name="td-operation" width="100" align="right">
        <template slot-scope="scope">
          <el-button-group class="operation">
            <el-button icon="el-icon-plus" type="text"></el-button>
            <!-- <edit-user-form :id="scope.row.id"></edit-user-form> -->
            <del-button :id="scope.row.id" store="users"></del-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { Action, State } from 'vuex-class';
// import EditUserForm from '~/components/admin/user/EditUserForm.vue';
import DelButton from '~/components/admin/DelButton.vue';

@Component({
  components: {
    // EditUserForm,
    DelButton
  },
  notifications: {
    bulkError: {
      icon: 'fas fa-exclamation-triangle',
      position: 'bottomLeft',
      title: 'Bulk',
      toastOnce: true,
      type: 'error'
    }
  }
})
export default class UserItems extends Vue {
  @Prop() loadingState: boolean;
  @State(state => state.groups.data) groups;

  onUnsignPerm() {

  }
}
</script>

<style lang="scss" scoped>
.perm-tag {
  margin-bottom: 1px;
}
</style>

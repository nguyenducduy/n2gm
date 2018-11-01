<template>
  <section class="user-info-table">
    <el-table
      ref="bulkSelected"
      :data="users"
      style="width: 100%"
      @selection-change="onSelectionChange"
      v-loading.fullscreen.lock="loadingState"
      row-key="id">
      <el-table-column type="selection"></el-table-column>
      <el-table-column :label="$t('pages.admin.user.label.name')"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div class="avatar">
            <img v-if="scope.row.avatar !== ''" :src="scope.row.avatar" width="30" height="30">
            <avatar v-else :username="scope.row.fullName" :size="30"></avatar>
          </div>
          <span class="fullname">
            {{ scope.row.fullName }}
            <nuxt-link :to="`/admin/profile/${scope.row.id}`">@{{ scope.row.screenName }}</nuxt-link>
          </span>
          <small class="email">{{ scope.row.email }}</small>
        </template>
      </el-table-column>
      <el-table-column
        prop="mobileNumber"
        :label="$t('pages.admin.user.label.mobileNumber')"
        width="130"
        align="center"></el-table-column>
      <el-table-column
        prop="oauthProvider"
        :label="$t('pages.admin.user.label.oauthProvider')"
        width="130"
        align="center"></el-table-column>
      <el-table-column :label="$t('pages.admin.user.label.group')" width="120" align="center">
        <template slot-scope="scope">
          <el-tag
            v-for="(group, index) in scope.row.groups" :key="index"
            :type="group.style"
            size="mini">
            {{ group.screenName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('pages.admin.user.label.status')" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status.style" size="mini">
            {{ scope.row.status.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('pages.admin.user.label.verifyType')" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.verifyType.style" size="mini">
            {{ scope.row.verifyType.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('pages.admin.user.label.isSuperUser')" align="center" width="50">
        <template slot-scope="scope">
          <i :class="'el-icon-' + (scope.row.isSuperUser === 1 ? 'check' : 'close')"></i>
        </template>
      </el-table-column>
      <el-table-column :label="$t('pages.admin.user.label.isStaff')" align="center" width="50">
        <template slot-scope="scope">
          <i :class="'el-icon-' + (scope.row.isStaff === 1 ? 'check' : 'close')"></i>
        </template>
      </el-table-column>
      <el-table-column :label="$t('pages.admin.user.label.isProfileUpdated')" align="center" width="50">
        <template slot-scope="scope">
          <i :class="'el-icon-' + (scope.row.isProfileUpdated === 1 ? 'check' : 'close')"></i>
        </template>
      </el-table-column>
      <el-table-column :label="$t('pages.admin.user.label.dateCreated')" width="100" align="center">
        <template slot-scope="scope">
          <small>{{ scope.row.dateCreated.readable }}</small>
        </template>
      </el-table-column>
      <el-table-column :label="$t('pages.admin.user.label.dateLastChangePassword')" width="100" align="center">
        <template slot-scope="scope">
          <small v-if="scope.row.dateLastChangePassword.timestamp > 0">{{ scope.row.dateLastChangePassword.readable }}</small>
          <small v-else><i class="el-icon-close"></i></small>
        </template>
      </el-table-column>
      <el-table-column class-name="td-operation" width="100" align="right">
        <template slot-scope="scope">
          <el-button-group class="operation">
            <edit-user-form :id="scope.row.id"></edit-user-form>
            <del-button :id="scope.row.id" store="users"></del-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-select v-model="bulkName" :placeholder="$t('default.selectAction')" size="small">
        <el-option v-for="item in bulkList" :key="item.value" :label="item.label" :value="item.value" size="small">
        </el-option>
      </el-select>
      <el-button style="margin-left: 10px" type="primary" size="small" @click="onBulkSubmit">
        {{ $t('default.submit') }}
      </el-button>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { Action, State } from 'vuex-class';
import EditUserForm from '~/components/admin/user/EditUserForm.vue';
import DelButton from '~/components/admin/DelButton.vue';
import Avatar from 'vue-avatar';

@Component({
  components: {
    EditUserForm,
    DelButton,
    Avatar
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
  @Action('users/bulk') bulkAction;
  @State(state => state.users.data) users;

  bulkSelected = [];
  bulkName = '';

  bulkError: ({ message: string, timeout: number }) => void;

  get bulkList() {
    return [
      { value: 'delete', label: this.$t('default.delete') },
      { value: 'active', label: this.$t('default.active') },
      { value: 'block', label: this.$t('default.block') }
    ];
  }

  onSelectionChange(item) { this.bulkSelected = item; }

  async onBulkSubmit() {
    if (this.bulkSelected.length === 0) {
      this.$message({
        showClose: true,
        message: this.$t('default.msg.noItemSelected').toString(),
        type: 'warning',
        duration: 2 * 1000
      })

      return;
    };

    if (this.bulkName === '') {
      this.$message({
        showClose: true,
        message: this.$t('default.msg.noActionChosen').toString(),
        type: 'warning',
        duration: 2 * 1000
      });

      return;
    }

    const isConfirm = await this.$confirm(
      this.$t('msg.confirmBulk').toString(),
      this.$t('default.warning').toString(),
      {
        confirmButtonText: this.$t('default.msg.confirm').toString(),
        cancelButtonText: this.$t('default.msg.cancel').toString(),
        type: 'warning',
        dangerouslyUseHTMLString: true
      }
    );

    if (isConfirm) {
      this.$emit('setLoading');

      const errors = await this.bulkAction({
        input: {
          itemSelected: this.bulkSelected,
          actionSelected: this.bulkName
        }
      });

      this.$emit('unsetLoading');

      if (!errors) {
        errors.map(err => {
          this.bulkError({
            message: err.message,
            timeout: 5000
          });
        })

        return;
      } else {
        return this.$emit('reload');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info-table {
  .avatar {
    margin-right: 10px;
    float: left;
    display: inline-block;
    padding-top: 7px;
    img {
      border-radius: 30px !important;
    }
  }
  .fullname,
  .email {
    display: block;
    width: 100%;

    a {
      color: #1e90ff;
      text-decoration: none;
    }
  }
  .el-table .cell.el-tooltip {
    overflow: visible;
  }
}

.el-icon-check {
  color: #2ed573;
}
.el-icon-close {
  color: #ff4757;
}
</style>

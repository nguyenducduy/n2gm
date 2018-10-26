<template>
  <div class="edit-button">
    <el-button
      type="text"
      icon="el-icon-edit-outline"
      @click="visible = true">
    </el-button>
    <el-dialog
      ref="dialog"
      :visible.sync="visible"
      v-on:open="onOpen"
      v-on:close="onClose"
      top="0"
      close-on-press-escape
      lock-scroll
      width="35%">
      <template slot="title">
        <h3><i class="el-icon-fa-user-plus"></i> {{ $t('edit-user-form') }}</h3>
      </template>
      <el-row :gutter="30">
        <el-form
          autoComplete="on"
          label-position="top"
          size="small"
          :model="form"

          ref="editUserForm">
          <el-col :md="12">
            <el-form-item :label="$t('pages.admin.user.form.fullName')">
              <el-input type="text" v-model="form.fullName"></el-input>
            </el-form-item>
            <el-form-item :label="$t('pages.admin.user.form.screenName')">
              <el-input type="text" v-model="form.screenName"></el-input>
            </el-form-item>
            <el-form-item :label="$t('pages.admin.user.form.email')">
              <el-input type="text" v-model="form.email" disabled=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item :label="$t('form.group')">
              <el-select
                multiple
                v-model="form.groups"
                :placeholder="$t('default.all')"
                style="width: 100%;">
                <el-option
                  v-for="item in formSource.groups"
                  :key="item.id" :label="item.screenName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('form.status')">
              <el-select
                clearable
                v-model="form.status"
                :placeholder="$t('default.all')"
                style="width: 100%;">
                <el-option
                  v-for="item in formSource.status"
                  :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-switch
                v-model="form.isSuperUser"
                active-text="Is SuperUser"
                active-value="1"
                inactive-value="3">
              </el-switch>
            </el-form-item>
            <el-form-item>
              <el-switch
                v-model="form.isStaff"
                active-text="Is Staff"
                active-value="1"
                inactive-value="3">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item style="margin-top: 30px">
                <el-button
                  type="primary"
                  :loading="loading"
                  @click.native.prevent="onSubmit">
                  Submit
                </el-button>
              </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop} from 'nuxt-property-decorator';
import { Action, State } from 'vuex-class';

@Component({
  notifications: {
    editError: {
      icon: 'fas fa-exclamation-triangle',
      position: 'bottomLeft',
      title: 'Edit',
      toastOnce: true,
      type: 'error'
    },
    editSuccess: {
      icon: 'fas fa-check',
      position: 'bottomLeft',
      title: 'Edit',
      toastOnce: true,
      type: 'success'
    }
  }
})
export default class EditUserForm extends Vue {
  @Prop() id: number;
  @Action('users/get') getAction;
  @Action('users/update') updateAction;
  @State(state => state.users.formSource) formSource;

  visible: boolean = false;
  loading: boolean = false;
  form: any = {};

  editSuccess: ({ message: string, timeout: number }) => void;
  editError: ({ message: string, timeout: number }) => void;

  async onSubmit() {

  }

  async onOpen() {
    const myUser = await this.getAction({ id: this.id });

    this.form = {
      fullName: myUser.fullName,
      screenName: myUser.screenName,
      email: myUser.email,
      isSuperUser: myUser.isSuperUser,
      isStaff: myUser.isStaff,
      status: myUser.status.value
    };
  }

  onClose() {
    this.visible = false;
  }
}
</script>

<style scoped>
.edit-button {
  float: left;
  display: inline-block;
}
</style>

<template>
  <div>
    <el-button
      type="text"
      icon="el-icon-plus"
      @click="visible = true">
      {{ $t('pages.admin.user.label.addUser') }}
    </el-button>
    <el-dialog
      ref="dialog"
      :visible.sync="visible"
      v-on:close="onClose"
      top="0"
      close-on-press-escape
      lock-scroll
      width="35%">
      <template slot="title">
        <h3><i class="el-icon-fa-user-plus"></i> {{ $t('pages.admin.user.label.addUser') }}</h3>
      </template>
      <el-row :gutter="30">
        <el-form
          autoComplete="on"
          label-position="top"
          size="small"
          :model="form"
          @submit.native.prevent
          ref="addUserForm">
          <el-col :md="12">
            <el-form-item :label="$t('pages.admin.user.form.fullName')"
              prop="fullName"
              :rules="[
                { required: true, message: $t('msg.nameIsRequired'), trigger: 'blur' }
              ]">
              <el-input type="text" v-model="form.fullName"></el-input>
            </el-form-item>
            <el-form-item :label="$t('pages.admin.user.form.email')"
              prop="email"
              :rules="[
                { required: true, message: this.$t('msg.emailIsRequired'), trigger: 'blur' },
                { type: 'email', message: this.$t('msg.emailInvalid'), trigger: 'blur,change' }
              ]">
              <el-input type="text" v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item :label="$t('pages.admin.user.form.password')"
              prop="password"
              :rules="[
                { required: true, message: this.$t('msg.passwordIsRequired'), trigger: 'blur' }
              ]">
              <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item :label="$t('pages.admin.user.form.group')"
              prop="groups"
              :rules="[
                { required: true, message: this.$t('msg.groupIsRequired'), trigger: 'change' }
              ]">
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
            <el-form-item :label="$t('pages.admin.user.form.status')"
              prop="status"
              :rules="[
                { required: true, message: this.$t('msg.statusIsRequired'), trigger: 'change' }
              ]">
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
            <el-form-item prop="isSuperUser">
              <el-switch
                v-model="form.isSuperUser"
                :active-text="$t('pages.admin.user.label.isSuperUser')"
                active-value="1"
                inactive-value="3">
              </el-switch>
            </el-form-item>
            <el-form-item prop="isStaff">
              <el-switch
                v-model="form.isStaff"
                :active-text="$t('pages.admin.user.label.isStaff')"
                active-value="1"
                inactive-value="3">
              </el-switch>
            </el-form-item>

          </el-col>
          <el-col :md="24">
            <el-form-item style="margin-top: 30px">
                <el-button type="primary" :loading="loading" @click.native.prevent="onSubmit">
                  Add
                </el-button>
              </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component} from 'nuxt-property-decorator';
import { Action, State } from 'vuex-class';

@Component({
  notifications: {
    addError: {
      icon: 'fas fa-exclamation-triangle',
      position: 'bottomLeft',
      title: 'Add',
      toastOnce: true,
      type: 'error'
    },
    addSuccess: {
      icon: 'fas fa-check',
      position: 'bottomLeft',
      title: 'Add',
      toastOnce: true,
      type: 'success'
    }
  }
})
export default class AddUserForm extends Vue {
  @Action('users/add') addAction;
  @State(state => state.users.formSource) formSource;

  visible: boolean = false;
  loading: boolean = false;
  form: any = {
    fullName: ''
  };

  addSuccess: ({ message: string, timeout: number }) => void;
  addError: ({ message: string, timeout: number }) => void;

  $refs: {
    addUserForm: HTMLFormElement
  }

  async onSubmit() {
    this.$refs.addUserForm.validate(async valid => {
      if (valid) {
        this.loading = true;

        const errors = await this.addAction({ input: this.form });

        if (typeof errors !== 'undefined') {
          this.loading = false;

          errors.map(err => {
            this.addError({
              message: err.message,
              timeout: 5000
            });
          })

          return;
        } else {
          this.loading = false;

          this.addSuccess({
            message: `${this.form.fullName}`,
            timeout: 1000
          });

          this.visible = false;
        }
      } else {
        return false;
      }
    });
  }

  onClose() {
    this.visible = false;
    this.$refs.addUserForm.resetFields();
  }
}
</script>

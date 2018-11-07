<template>
  <el-form
    autoComplete="on"
    label-position="top"
    size="small"
    :model="form"
    inline
    @submit.native.prevent
    ref="addPermissionForm"
    style="background-color: rgba(84, 160, 255, 0.05); padding: 16px;">
    <el-form-item
      prop="name"
      :label="$t('pages.admin.group.form.permissionName')"
      :rules="[
        { required: true, message: $t('pages.admin.group.msg.nameIsRequired'), trigger: 'blur' }
      ]">
      <el-input type="text" v-model="form.name" />
    </el-form-item>
    <el-form-item
      prop="description"
      :label="$t('pages.admin.group.form.permissionDescription')"
      :rules="[
        { required: true, message: $t('pages.admin.group.msg.descriptionIsRequired'), trigger: 'blur' }
      ]"
      style="width: 50%">
      <el-input type="textarea" autosize v-model="form.description" />
    </el-form-item>
    <el-form-item style="padding-top: 40px;">
      <el-button
        :loading="loading"
        type="primary"
        @click.native.prevent="onSubmit">
        {{ $t('default.add') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { Action, State } from 'vuex-class';

@Component({
  notifications: {
    addError: {
      icon: 'fas fa-exclamation-triangle',
      position: 'topCenter',
      title: 'Add',
      toastOnce: true,
      type: 'error'
    },
    addSuccess: {
      icon: 'fas fa-check',
      position: 'topCenter',
      title: 'Add',
      toastOnce: true,
      type: 'success'
    }
  }
})
export default class AddPermissionForm extends Vue {
  @Action('permissions/add') addAction;

  loading: boolean = false;
  form: any = {};

  addSuccess: ({ message: string, timeout: number }) => void;
  addError: ({ message: string, timeout: number }) => void;

  $refs: {
    addPermissionForm: HTMLFormElement
  }

  async onSubmit() {
    this.$refs.addPermissionForm.validate(async valid => {
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
            message: `${this.form.name}`,
            timeout: 1000
          });

          this.$refs.addPermissionForm.resetFields();
        }
      } else {
        return false;
      }
    });
  }
}
</script>

<style scoped>
.el-textarea__inner {
  border-radius: 2px;
}
</style>

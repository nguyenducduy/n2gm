<template>
  <div>
    <el-button type="text" icon="el-icon-plus" @click="visible = true">Add</el-button>
    <el-dialog
      ref="dialog"
      :visible.sync="visible"
      v-on:close="onClose"
      top="0"
      close-on-press-escape
      lock-scroll
      width="35%">
      <template slot="title">
        <h3><i class="el-icon-fa-user-plus"></i> {{ $t('add-user-form') }}</h3>
      </template>
      <el-row :gutter="30">
        <el-form
          autoComplete="on"
          label-position="left"
          :model="form"
          ref="addUserForm">
          <el-col :md="12">
            <el-form-item :label="$t('pages.admin.user.form.fullName')">
              <el-input type="text" size="small" v-model="form.fullName"></el-input>
            </el-form-item>
            <el-form-item :label="$t('pages.admin.user.form.email')">
              <el-input type="text" size="small" v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item :label="$t('pages.admin.user.form.password')">
              <el-input type="password" size="small" v-model="form.password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
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
                <el-button type="primary" :loading="loading" @click.native.prevent="onSubmit"> Add
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
import { Action } from 'vuex-class';

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

  visible = false;
  loading = false;
  form = {};

  $refs: {
    addUseForm: HTMLFormElement
  }

  addSuccess: ({ message: string, timeout: number }) => void;
  addError: ({ message: string, timeout: number }) => void;

  async onSubmit() {
    // this.loading = true;

    const errors = await this.addAction({ input: this.form });

    // if (typeof errors !== 'undefined') {
    //   this.loading = false;
    //   errors.map(err => {
    //     this.addError({
    //       message: err.message,
    //       timeout: 5000
    //     });
    //   })

    //   return;
    // } else {
    //   this.loading = false;
    //   this.addSuccess({
    //     message: `${this.form.name}`,
    //     timeout: 1000
    //   });
    //   this.visible = false;
    // }
  }

  onClose() {
    this.form = {};
    this.visible = false;
  }
}
</script>

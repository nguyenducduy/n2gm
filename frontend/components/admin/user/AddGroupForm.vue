<template>
  <div>
    <el-button type="text" icon="el-icon-plus" @click="visible = true">Add group</el-button>
    <el-dialog
      ref="dialog"
      :visible.sync="visible"
      v-on:close="onClose"
      top="0"
      close-on-press-escape
      lock-scroll
      width="25%">
      <template slot="title">
        <h3><i class="el-icon-fa-users"></i> {{ $t('add-group-form') }}</h3>
      </template>
      <el-row :gutter="30">
        <el-form
          autoComplete="on"
          label-position="top"
          size="small"
          :model="form"

          ref="addUserForm">
          <el-col :md="24">
            <el-form-item :label="$t('pages.admin.user.form.groupName')">
              <el-input type="text" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('pages.admin.user.form.groupScreenName')">
              <el-input type="text" v-model="form.screenName"></el-input>
            </el-form-item>
            <el-form-item :label="$t('pages.admin.user.form.groupStyle')">
              <el-input type="text" v-model="form.style"></el-input>
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
export default class AddGroupForm extends Vue {
  @Action('users/add') addAction;
  @State(state => state.users.formSource) formSource;

  visible = false;
  loading = false;
  form = {
    fullName: ''
  };

  addSuccess: ({ message: string, timeout: number }) => void;
  addError: ({ message: string, timeout: number }) => void;

  async onSubmit() {
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
  }

  onClose() {
    this.visible = false;
  }
}
</script>

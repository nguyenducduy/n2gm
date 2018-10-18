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
      <el-row>
        <el-col :md="24">
          <el-form autoComplete="on" label-position="left" :model="form" ref="addUseForm">
             <el-form-item label="Name">
              <el-input type="text" size="small" v-model="form.name"></el-input>
            </el-form-item>
           
            <el-form-item style="margin-top: 30px">
              <el-button type="primary" :loading="loading" @click.native.prevent="onSubmit"> Add
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
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
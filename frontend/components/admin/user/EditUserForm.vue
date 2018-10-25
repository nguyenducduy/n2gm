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
import { Vue, Component} from 'nuxt-property-decorator';
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
  visible: boolean = false;

  editSuccess: ({ message: string, timeout: number }) => void;
  editError: ({ message: string, timeout: number }) => void;

  async onSubmit() {

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

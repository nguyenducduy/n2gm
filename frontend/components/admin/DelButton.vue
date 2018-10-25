<template>
  <div class="del-button">
    <el-button
      type="text"
      icon="el-icon-delete"
      v-popover:deletePop>
    </el-button>
    <el-popover
      ref="deletePop"
      placement="left"
      v-model="visible">
      <p>{{ $t('default.msg.deleteConfirm') }}</p>
      <div style="text-align: right; margin: 0">
        <el-button
          size="mini"
          type="text"
          @click="onCancel">
          {{ $t('default.msg.cancel') }}
        </el-button>
        <el-button
          size="mini"
          type="text"
          @click="onConfirm">
          <span class="text-danger">
            {{ $t('default.msg.confirm') }}
          </span>
        </el-button>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component({
  notifications: {
    deleteError: {
      icon: 'fas fa-exclamation-triangle',
      position: 'bottomLeft',
      title: 'Delete',
      toastOnce: true,
      type: 'error'
    },
    deleteSuccess: {
      icon: 'fas fa-check',
      position: 'bottomLeft',
      title: 'Delete',
      toastOnce: true,
      type: 'success'
    }
  }
})
export default class DelButton extends Vue {
  @Prop() id: number;
  @Prop() store: string;

  visible: boolean = false;

  deleteSuccess: ({ message: string, timeout: number }) => void;
  deleteError: ({ message: string, timeout: number }) => void;

  async onConfirm() {
    this.visible = true;

    // const res = await this.$store.dispatch(`${this.store}/delete`, {
    //   id: this.id
    // });


  }

  onCancel() {
    this.visible = false;
  }
}
</script>

<style lang="scss" scoped>
.del-button {
  float: left;
  display: inline-block;
  margin-left: 10px;
  margin-right: 10px;

  .el-button--text {
    color: #f56c6c;
  }
}

.text-danger {
  color: #f56c6c;
}
</style>

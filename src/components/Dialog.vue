<template>
  <el-dialog
    :model-value="Show"
    :title="title"
    :width="width"
    :show-close="showClose"
    :draggable="true"
    :close-on-click-modal="false"
    class="cust-dialog"
    :top="top"
    @close="close"
  >
    <div class="dialog-body">
      <slot> </slot>
    </div>
    <template v-if="(buttons && buttons.length > 0) || showCancel">
      <div class="dialog-footer">
        <el-button link @click="close" v-if="showCancel" type="primary"
          >取消</el-button
        >
        <el-button
          v-for="(btn, index) in buttons"
          :key="index"
          :type="btn.type"
          @click="btn.click"
          >{{ btn.text }}</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {defineEmits} from 'vue'
const props = defineProps({
  Show: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "标题",
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: "30%",
  },
  top: {
    type: String,
    default: "30px",
  },
  buttons: {
    type: Array,
    default: [],
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["close"]);
const close = function () {
  emit("close");
};
</script>

<style lang="scss" scoped>
.cust-dialog {
  margin: 0 auto !important;
  .el-dialog__body {
    padding: 0px;
  }
  .dialog-body {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 15px;
    min-height: 100px;
    max-height: calc(100vh - 190px);
    overflow: auto;
  }
  .dialog-footer {
    text-align: right;
    padding: 10px 20px;
  }
}
</style>

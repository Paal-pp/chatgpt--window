<!-- RenameModal.vue -->
<template>
  <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <h3>重命名会话</h3>
      <input v-model="newName" :placeholder="defaultName">
      <div class="modal-actions">
        <button @click="confirm">确认</button>
        <button @click="cancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    old_title: String // 接收旧标题作为prop
  },
  data() {
    return {
      newName: this.old_title // 使用旧标题初始化输入框的值
    };
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.newName); // 发出确认事件，并附带新名称
    },
    cancel() {
      this.$emit('cancel'); // 发出取消事件
    }
  }
};
</script>

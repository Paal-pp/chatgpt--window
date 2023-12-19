<template>
  <div class="session-options">
    <!-- 更多选项按钮 -->
    <button @click="toggleDropdown">...</button>
    <!-- 下拉菜单 -->
    <div v-if="showDropdown" class="dropdown-menu">
      <a href="#" @click="emitRename">重命名</a>
      <a href="#" @click="emitDelete">删除</a>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps(['session']);
const emit = defineEmits(['rename', 'delete']);
const showDropdown = ref(false);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const emitRename = () => {
  emit('rename', props.session);
  showDropdown.value = false;
};

const emitDelete = () => {
  emit('delete', props.session);
  showDropdown.value = false;
};
</script>



<style>
.dropdown-menu {
  display: block; /* 显示下拉菜单 */
  position: absolute;
  z-index: 100; /* 确保下拉菜单在其他元素上面 */
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 0;
  /* 其他样式，如阴影、间距等 */
}

.dropdown-menu a {
  padding: 8px 16px;
  display: block;
  text-decoration: none;
  color: black;
  /* 鼠标悬浮样式 */
}

.dropdown-menu a:hover {
  background-color: #f5f5f5;
}

</style>

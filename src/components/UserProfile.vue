<template>
  <div className="user-profile">
    <img :src="user.avatar" alt="User Avatar">
    <h3>{{ user.name }}</h3>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UserProfile',
  props: {
    user: {
      type: Object,
      default: () => ({
        name: 'Default Name',
        avatar: 'default-avatar.png'
      })
    }
  },
  // ...
});
</script>

<style scoped>
.user-profile {
  /* 样式调整 */
  display: flex;
  align-items: center;
  justify-content: center; /* 如果你希望居中对齐 */
}

.user-profile img {
  width: 50px; /* 调整为你希望的尺寸 */
  height: 50px;
  border-radius: 50%; /* 使头像呈现圆形 */
  margin-right: 10px; /* 右边距 */
}

.user-profile h3 {
  margin: 0; /* 移除默认的 margin */
}
</style>

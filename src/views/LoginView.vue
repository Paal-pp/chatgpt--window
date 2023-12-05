<template>
  <div class="login-container">
    <h2 class="main-title">登录</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <div class="label-container">
          <label for="username">用户名:</label>
        </div>
        <div class="input-container">
          <input type="text" id="username" v-model="credentials.username" required>
        </div>
      </div>
      <div class="form-group">
        <div class="label-container">
          <label for="password">密码:</label>
        </div>
        <div class="input-container">
          <input type="password" id="password" v-model="credentials.password" required>
        </div>
      </div>
      <button class ="submit-button" type="submit" >登录</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  setup() {
    const credentials = ref({ username: '', password: '' });
    const error = ref('');
    const router = useRouter();

    const login = async () => {
      try {
        // 使用模板字符串``以便插入变量
        const response = await axios.post(`http://127.0.0.1:5000/login`, credentials.value);
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('username', response.data.Username);
        localStorage.setItem('userId', response.data.Userid);
        await router.push('/'); // 假设登录成功后跳转到主页
      } catch (err) {
        console.error(err); // 将错误记录到控制台以便调试
        if (err.response) {
          // 处理服务器返回的HTTP错误
          error.value = err.response.data.error || '服务器发生错误。';
        } else if (err.request) {
          // 请求已发出，但未收到响应
          error.value = '服务器无响应。请检查您的网络连接。';
        } else {
          // 请求设置过程中发生了触发错误的事情
          error.value = '设置请求时发生错误。';
        }
      }
    };
    return { credentials, error, login };
  }
};
</script>

<style>
.login-container {
  max-height: 80vh;
  height: 80vh;
  width: calc(150vh * 1.168); /* 宽度是高度的1.168倍 */
  background-color: #f0f0f0; /* 淡灰色背景 */
  border-radius: 4vh; /* 圆角 */
  box-shadow: 0 1vh 1vh rgba(0, 0, 0, 0.1); /* 轻微的阴影效果 */

  position: absolute; /* 绝对定位 */
  top: 50%; /* 顶部距离视口中心的50% */
  left: 50%; /* 左侧距离视口中心的50% */
  transform: translate(-50%, -50%); /* 向上和向左偏移自身尺寸的50% */

  display: flex; /* 使用flex布局 */
  flex-direction: row; /* 横向布局 */
  align-items: center; /* 垂直居中子元素 */
  justify-content: center; /* 水平居中子元素 */
}
.main-title{
  position: absolute;
  top: 10vh;
  align-items: center; /* 垂直居中子元素 */
  justify-content: center; /* 水平居中子元素 */
  font-size: 10vh; /* 设置字体大小 */
}
.form-group {
  display: flex;

  margin-bottom: 10px;
  align-items: center; /* 垂直居中子元素 */
  justify-content: center; /* 水平居中子元素 */
  font-size: 2vh; /* 设置字体大小 */
}

.label-container {
  flex: 0 0 100px; /* 固定标签的宽度 */
  text-align: right;
  margin-right: 10px; /* 标签和输入框之间的间距 */
}

.input-container {
  flex: 1; /* 输入框占据剩余空间 */
}
.submit-button{
  width: 100%; /* 或者指定一个宽度，如 200px */
  padding: 10px 20px; /* 按钮内部的填充，根据需要调整 */
  font-size: 1.5em; /* 按钮文字大小，根据需要调整 */
  margin-top: 20px; /* 按钮与表单元素之间的间距 */
  cursor: pointer; /* 鼠标悬停时显示指针 */
}
</style>

<template>
  <!-- 登录容器，包含整个登录界面 -->
  <div class="login-container">
    <!-- 登录表单的外层容器 -->
    <div class="login-form">
      <div class="left-form">

      </div>
      <div class="right-form">
        <!-- 登录表单 -->
        <form @submit.prevent="login">
          <!-- 用户名输入 -->
          <label for="username" class="form-label">用户名</label>
          <input type="text" id="username" v-model="credentials.username" placeholder="Username" class="form-input">
          <!-- 密码输入 -->
          <label for="password" class="form-label">密码</label>
          <input type="password" id="password" v-model="credentials.password" placeholder="Password" class="form-input">
          <!-- 记住我复选框 -->
          <div class="remember-me">
<!--            <input type="checkbox" id="remember" v-model="remember" class="checkbox">-->
<!--            <label for="remember" class="form-label">记住密码</label>-->
          </div>
          <!-- 登录按钮 -->
          <button type="submit" class="login-button">登  录</button>
        </form>
      </div>
    </div>
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
    const apiUrl = import.meta.env.VITE_API_URL;

    const login = async () => {
      console.log("开始登录")
      try {
        console.log("credentials",credentials.value)
        // 使用模板字符串``以便插入变量
        const response = await axios.post(`${apiUrl}/login`, credentials.value);
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('username', response.data.Username);
        localStorage.setItem('userId', response.data.Userid);
        await router.push('/chat'); // 假设登录成功后跳转到主页
      } catch (err) {
        console.log(err)
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
/* 全局样式重置 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-image: url('/login_backgroup.jpg');
  background-size: cover;
  overflow: hidden;
}

.login-container {
  display: flex; /* 使用 flex 布局 */
  align-items: stretch; /* 确保子项高度相同 */
  height: 100vh; /* 容器高度为视口的高度 */
}

.login-form {
  width: 41.25vw;
  min-height: 51.75vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: stretch; /* 这将确保子元素高度拉伸以匹配容器的高度 */
}

.left-form, .right-form {
  flex: 1; /* 两个子容器平分可用空间 */
  display: flex;
  flex-direction: column;
}


.left-form {
  background-image: url('/muzata-login.jpg');
  background-size: cover;
  background-position: center center;
}

.right-form {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  justify-content: center;
  padding: 20px;
}


.form-label {
  /* 移除标签的外边距确保紧挨复选框 */
  font-size: 20px; /* 字体大小根据效果图调整 */
  color: #333; /* 字体颜色 */
  /* 与输入框的间距 */
  margin: 0 0 8px;

  display: block
}

.checkbox{
  margin-right: 5px;
}
.form-input {
  width: 60%; /* 调整宽度为父容器的60% */
  border: 1px solid #CCC;
  border-radius: 4px;
  padding: 15px;
  font-size: 16px;
  margin-bottom: 20px; /* 保持输入框之间的间距 */
}
.login-button {
  width: 20%; /* 按钮宽度占满父容器 */
  background-color: #0041c6; /* 按钮背景颜色 */
  color: white; /* 按钮文字颜色 */
  border: none; /* 无边框 */
  border-radius: 4px; /* 圆角边框 */
  padding: 15px; /* 较大的内边距 */
  font-size: 18px; /* 较大的字体大小 */
  cursor: pointer; /* 鼠标指针变为手形 */
}
.checkbox {
  margin-right: 10px; /* 复选框和标签之间的间距 */
}

.remember-me {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  margin-bottom: 20px; /* 与登录按钮的间距 */
  justify-content: flex-start; /* 水平方向靠左对齐 */
}

.login-button:hover {
  background-color: darkblue;
}


@media (max-width: 768px) {
  .login-form {
    width: 90%; /* 在较小屏幕上，可能需要调整为固定百分比 */
    height: auto; /* 高度可调整为自动，以适应内容 */
    flex-direction: column;
  }

  .left-form, .right-form {
    width: 100%;
  }

  .left-form {
    order: 2; /* 在移动视图中将图片放在底部 */
  }

  .right-form {
    order: 1; /* 将表单放在顶部 */
  }
}

</style>
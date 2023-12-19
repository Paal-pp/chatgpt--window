<template>
  <!-- 登录容器，包含整个登录界面 -->
  <div class="login-container">
    <!-- 登录表单的外层容器 -->
    <div class="login-form">
      <div class="left-form">
            <img src="/muzata-login.jpg">
      </div>
      <div class="right-form">
      <h1 class="MontserratAlternates">Hello!</h1>
      <p class="Poppinslight">Welcome to GPT, merande's internal network</p>
      <!-- 登录表单 -->
      <form @submit.prevent="login">
        <!-- 用户名输入 -->
        <h2 class="Poppinslight">Username</h2>
        <input type="Username" v-model="credentials.username" placeholder="Username" >
        <!-- 密码输入 -->
        <h3 class="Poppinslight">Password</h3>
        <input type="Password" v-model="credentials.password" placeholder="Password" class="Poppinslight">
        <!-- 记住我复选框 -->
        <div class="remember-me">
          <input type="checkbox" id="remember" v-model="remember" class="Poppinsmedium">
          <label for="remember" class="Poppinslight">Remember me</label>
        </div>
        <!-- 登录按钮 -->
        <button type="submit" class="Poppinsmedium">Sign In</button>
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
    const apiUrl = import.meta.env.VITE_API_URL;
    const credentials = ref({ username: '', password: '' });
    const error = ref('');
    const router = useRouter();

    const login = async () => {
      try {
        console.log('API URL:', apiUrl);
        // 使用模板字符串``以便插入变量
        const response = await axios.post(`${apiUrl}`+`/login`, credentials.value);
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('username', response.data.Username);
        localStorage.setItem('userId', response.data.Userid);
        console.log('API URL:', apiUrl);
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
/* 全局样式重置 */
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  min-width: 100vh;
  background-image: url('/login_backgroup.jpg'); /* 确保路径和文件名正确 */
  background-size:cover;
  overflow: hidden; /* 防止滚动条的产生 */
}
.login-form {
  background-color: #ffffff;
  width: 55vw;       /* 设置宽度为视口宽度的70% */
  height: 69vh;      /* 设置高度为视口高度的60% */
  position: absolute; /* 确保子元素的绝对定位是相对于此容器 */
  top: 50%;          /* 顶部对齐到视口中心 */
  left: 50%;         /* 左侧对齐到视口中心 */
  transform: translate(-50%, -50%); /* 使用变换向左和向上移动自身宽度和高度的50% */
  display: flex;    /* 启用Flexbox */
  padding: 0; /* 确保父元素没有内边距 */
  margin: 0; /* 确保父元素没有外边距 */
}
.left-form {
  position: absolute;
  left: 0;
  width: 50%; /* 设定宽度为父容器的30% */
  height: 100%; /* 高度与父容器相同 */
  padding: 0; /* 确保父元素没有内边距 */
  margin: 0; /* 确保父元素没有外边距 */
}

.left-form img {
  width: 100%; /* 图片宽度占满容器 */
  height: 100%; /* 图片高度占满容器 */
  object-fit: contain; /* 保持图片原始长宽比例 */
}
.right-form h1 {
  font-size:400%;
  display: flex;
  flex-direction: column; /* 子元素垂直排列 */
  position: absolute;
  top :7vh;
  left: 2vh;
  width: 100%; /* 可以指定一个最大宽度，例如 max-width: 300px; */

}
.right-form p {
  position: absolute;
  top :13vh;
  left: 2vh;
  font-size:250%;
  color: #cccccc;
  display: flex;
  flex-direction: column; /* 子元素垂直排列 */
  align-items: center; /* 子元素水平居中 */
  width: 95%; /* 可以指定一个最大宽度，例如 max-width: 300px; */

}
.right-form h2{
  position: absolute;
  top :28vh;
  left: 2vh;
  font-size:150%;
  color: #cccccc;
  display: flex;
  flex-direction: column; /* 子元素垂直排列 */
  width: 100%; /* 可以指定一个最大宽度，例如 max-width: 300px; */
}
.right-form h3{
  position: absolute;
  top :35vh;
  left: 2vh;
  font-size:150%;
  color: #cccccc;
  display: flex;
  flex-direction: column; /* 子元素垂直排列 */
  width: 100%; /* 可以指定一个最大宽度，例如 max-width: 300px; */
}
.right-form form {
  display: flex;
  flex-direction: column; /* 子元素垂直排列 */
  align-items: center; /* 子元素水平居中 */
  width: 100%; /* 可以指定一个最大宽度，例如 max-width: 300px; */
}
/* 输入框样式 */
.right-form input[type="Username"] {
  position: absolute;
  top :33vh;
  left: 2vh;
  padding: 10px;
  width: 60%;
  margin-bottom: 10px; /* 输入框之间的间距 */
  border: 1px solid #ddd; /* 边框样式 */
  border-radius: 4px; /* 轻微的圆角 */
  box-sizing: border-box; /* 边框和内填充包含在宽度内 */
}
.right-form input[type="Password"] {
  position: absolute;
  top :40vh;
  left: 2vh;
  padding: 10px;
  width: 60%;
  margin-bottom: 10px; /* 输入框之间的间距 */
  border: 1px solid #ddd; /* 边框样式 */
  border-radius: 4px; /* 轻微的圆角 */
  box-sizing: border-box; /* 边框和内填充包含在宽度内 */
}
.right-form {
  position: absolute;
  right: 0;
  width: 50%; /* 剩余的宽度 */
  height: 100%; /* 高度与父容器相同 */
  display: flex;
  flex-direction: column;
  padding: 0; /* 确保父元素没有内边距 */
  margin: 0; /* 确保父元素没有外边距 */
}
/* 记住我复选框样式 */
.remember-me {
  position: absolute;
  top :44vh;
  left: 2vh;
  display: flex; /* 使用flex布局 */
  justify-content: center; /* 居中复选框 */
  margin-bottom: 10px; /* 与按钮间的间距 */
}
/* 按钮样式 */
.right-form button {
  position: absolute;
  top :50vh;
  left: 2vh;
  padding: 10px;
  width: 20%;
  background-color: #0041c6; /* 按钮背景颜色 */
  color: white; /* 按钮文字颜色 */
  border: none;
  border-radius: 4px;
  cursor: pointer; /* 鼠标悬停时的手型图标 */
  box-sizing: border-box; /* 边框和内填充包含在宽度内 */
}
.right-form button:hover {
  background-color: darkblue; /* 鼠标悬停时的背景颜色变化 */
}
.Poppinsmedium {
  font-family: 'Poppins medium',serif ;
}
.MontserratAlternates {
   font-family: 'Montserrat Alternates',serif ;
 }

</style>

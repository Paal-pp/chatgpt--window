<template>
  <div class="chat-container">
    <div class="sidebar">
      <!-- 用户资料 -->
      <UserProfile :user="user" class="user-profile" />
      <!-- 历史会话信息 -->
      <div class="chat-history">
        <ChatHistory :sessions="sessions" @selectSession="handleSelectSession" />
      </div>
      <!-- 账号信息 -->
      <div class="account-info">
        <!-- 账号信息内容 -->
      </div>
    </div>
    <!-- 聊天消息区域 -->
    <div class="chat-messages">
      <!-- 消息列表 -->
      <div class="messages-list">
        <ChatSession :messages="messages" @sendMessage="handleSendMessage" />
      </div>
      <!-- 输入框和发送按钮 -->
      <div class="input-area">
        <input type="text" placeholder="Type a message...">
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import UserProfile from '@/components/UserProfile.vue';
import ChatHistory from '@/components/ChatHistory.vue';
import ChatSession from '@/components/ChatSession.vue';

export default {
  components: {
    UserProfile,
    ChatHistory,
    ChatSession
  },
  setup() {
    const user = ref({
      name: 'User Name',
      avatar: 'path_to_avatar_image'
    });
    const sessions = ref([
      // ... Array of chat history sessions
    ]);
    const messages = ref([
      // ... Array of messages for the current session
    ]);

    const handleSelectSession = (sessionId) => {
      // Logic to select a session and load its messages
    };

    const handleSendMessage = (message) => {
      // Logic to send a message and update the current session
    };

    return {
      user,
      sessions,
      messages,
      handleSelectSession,
      handleSendMessage
    };
  }
};
</script>

<style>
/* 全局样式 */
* {
  box-sizing: border-box;
}

body, html {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f0f0f0; /* 调整背景色以匹配效果图 */
}

/* 聊天容器样式 */
.chat-container {
  display: flex;
  width: 80%; /* 调整为视觉上更适合的百分比宽度 */
  height: 80vh; /* 调整为视觉上更适合的视窗高度百分比 */
  margin: 10vh auto; /* 居中并设置垂直外边距 */
  border: 3px solid black; /* 外围边框 */
  background-color: #fff; /* 白色背景 */
}

</style>
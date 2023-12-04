<template>
  <div id="chatting-records">
    <div class="container">
      <div class="history-panel">
        <div class="history-item" v-for="chat in chatHistory" :key="chat.id">
          <div class="history-content">
            <p class="history-title">{{ chat.title }}</p>
            <p class="history-preview">{{ chat.preview }}</p>
          </div>
          <button class="delete-btn" @click="deleteChat(chat.id)">✖️</button>
        </div>
        <div class="account-info">
          <img class="account-avatar" src="account_avatar.jpg" alt="Account Avatar">
          <p class="account-name">账号名称</p>
        </div>
      </div>
      <div class="chat-container">
        <!-- 聊天窗口和其他内容 -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      chatHistory: [
        { id: 1, title: 'Alice', preview: 'Hello, how are you?' },
        { id: 2, title: 'Bob', preview: 'Are you available tomorrow?' },
        // 更多历史记录...
      ],
      // ...其他数据...
    };
  },
  methods: {
    deleteChat(chatId) {
      this.chatHistory = this.chatHistory.filter(chat => chat.id !== chatId);
    },
    // ...其他方法...
  }
};
</script>

<style>
.container {
  display: flex;
  height: 80vh; /* 与聊天界面组件一致的高度 */
}

.history-panel {
  width: 15vw; /* 与聊天窗口一致的宽度 */
  background-color: #f5f5f5;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ccc; /* 统一边框风格 */
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc; /* 统一边框风格 */
}

.history-content {
  flex-grow: 1;
}

.history-title {
  font-weight: bold;
  color: black; /* 可能需要调整以匹配聊天界面的字体颜色 */
}

.history-preview {
  font-size: small;
  color: grey; /* 可能需要调整以匹配聊天界面的字体颜色 */
}

.delete-btn {
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.account-info {
  margin-top: auto;
  padding: 10px;
  text-align: center;
}

.account-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.account-name {
  margin-top: 10px;
  color: black; /* 可能需要调整以匹配聊天界面的字体颜色 */
}

</style>

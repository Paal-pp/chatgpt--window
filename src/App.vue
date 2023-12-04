<template>
  <div id="app">
    <div classnam="app-container">
      <chatting-records className="sidebar"></chatting-records>
      <chat-window className="main-content"></chat-window>
    </div>
  </div>
</template>

<script>
import ChattingRecords from './components/ChattingRecords.vue';
import ChatWindow from './components/ChatWindow.vue';

export default {
  name: 'App',
  components: {
    ChattingRecords,
    ChatWindow
  }
};
</script>

<style>
.app-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  /* 保持与ChattingRecords.vue中.history-panel的宽度相同 */
  width: 300px;
  border-right: 1px solid #ddd;
}

.main-content {
  /* 保持与ChatWindow.vue中.chat-window的宽度相同 */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* 以下是统一的样式设置，确保风格一致 */
.sidebar, .main-content {
  background-color: #f5f5f5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>

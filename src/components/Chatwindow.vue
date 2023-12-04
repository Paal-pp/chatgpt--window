  <template>
    <div id="chat-window">
      <div class="chat-container">
        <div class="chat-window">
          <div class="chat-header">新聊天</div>
          <div class="chat-body">
            <div v-for="message in messages" :key="message.id" class="message">
              <img v-if="!message.self" class="avatar received-avatar" src="path_to_receiver_avatar.jpg">
              <div :class="['message-content', message.self ? 'sent' : 'received']">
                {{ message.text }}
              </div>
              <img v-if="message.self" class="avatar sent-avatar" src="path_to_sender_avatar.jpg">
            </div>
          </div>
          <div class="chat-footer">
            <textarea v-model="newMessage"
                      @keyup.enter="sendMessage"
                      placeholder="输入消息..."
                      rows="1"></textarea>
            <button @click="sendMessage">发送</button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  export default {
    name: 'App',
    data() {
      return {
        newMessage: '',
        messages: [
          { id: 1, text: '你好！', self: false },
          { id: 2, text: '嗨，怎么了？', self: true },
          // 更多消息...
        ],
        // 在实际应用中，这些头像的路径可能来自用户的账户信息
        senderAvatar: 'path_to_sender_avatar.jpg',
        receiverAvatar: 'path_to_receiver_avatar.jpg'
      };
    },
    methods: {
      sendMessage() {
        // ...发送消息的逻辑...
      }
    }
  };
  </script>

  <style>
  .avatar {
    width: 40px; /* 设置头像大小 */
    height: 40px; /* 设置头像大小 */
    border-radius: 50%; /* 圆形头像 */
    object-fit: cover; /* 保证图片覆盖整个容器 */
  }

  .sent-avatar {
    margin-left: 10px;
    order: 2; /* Flex布局，确保头像在消息内容的右侧 */
  }

  .received-avatar {
    margin-right: 10px;
    order: -1; /* Flex布局，确保头像在消息内容的左侧 */
  }

  .message {
    display: flex;
    align-items: center; /* 垂直居中对齐消息和头像 */
    justify-content: flex-end; /* 对于发送的消息，确保内容靠右 */
  }

  .received .message {
    justify-content: flex-start; /* 对于接收的消息，确保内容靠左 */
  }

  .message-content {
    max-width: calc(50% - 50px); /* 减去头像和间距的宽度 */
    /* ...其他样式保持不变... */
  }
  .chat-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .chat-window {
    width: 40vw;
    height: 80vh; /* Adjust the height as per your requirement */
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Optional: added some shadow for better visuals */
  }

  .chat-header {
    background-color: #f5f5f5;
    padding: 10px;
    text-align: center;
  }

  .chat-body {
    overflow-y: auto;
    padding: 10px;
    flex-grow: 1;
    display: flex;
    flex-direction: column; /* 新增：确保消息按顺序堆叠 */
  }

  .message {
    display: flex; /* 新增：使得每个消息都能够使用flex布局的优势 */
    justify-content: flex-start; /* 默认情况下，消息向左对齐 */
    margin-bottom: 10px;
  }

  .message-content {
    padding: 5px 10px;
    border-radius: 15px;
    max-width: 50%;
    word-wrap: break-word;
    margin-bottom: 10px; /* 为了简化，这里可以去掉，因为.message已经有margin-bottom */
  }

  .sent {
    background-color: #9fecff;
    margin-left: auto; /* 将发送的消息推向右侧 */
    align-self: flex-end; /* 新增：确保消息在交叉轴上对齐到末尾 */
  }

  .received {
    background-color: #e5e5e5;
    align-self: flex-start; /* 新增：确保消息在交叉轴上对齐到开头 */
  }


  .chat-footer {
    display: flex;
    padding: 10px;
    background-color: #f5f5f5;
  }

  .chat-footer input {
    flex: 1;
    margin-right: 10px;
  }

  .chat-footer button {
    padding: 5px 10px;
  }
  </style>

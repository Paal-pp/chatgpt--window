  <template>
    <div class="chat-container">
      <div class="sidebar">
        <!-- 历史会话信息 -->
        <div class="chat-history">
          <div v-for="session in sessions" :key="session.id" class="session-item">
            <button @click="selectSession(session)">{{ session.title }}   -        {{session.last_updated}}</button>
            <ChatHistory :sessionId="selectedSessionId" />
          </div>

        </div>

        </div>
        <!-- 账号信息 -->
        <div class="account-info">
          <div class="user-profile-avatar" style="background-image: url('public/Snipaste_2023-12-05_10-43-44.png');"></div>
          <span class="user-profile-id">{{ user.username }}</span>
          <!-- 账号信息内容 -->
        </div>

      <!-- 聊天消息区域 -->
      <div class="chat-messages">
        <!-- 消息列表 -->
        <div class="messages-list">
          <ChatHistory :sessions="sessions" />
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
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
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
        userId: localStorage.getItem('userId') || null,
        username: localStorage.getItem('username') || 'Unknown User',
        access_token: localStorage.getItem('access_token') || null
      });
      const sessions = ref([]);

      const selectedSession = ref(null);
      const selectedSessionId = ref(null);
      const fetchUserData = () => {
        user.value.userId = localStorage.getItem('userId');
        user.value.username = localStorage.getItem('username') || 'Unknown User';
        user.value.access_token = localStorage.getItem('access_token');

        // 只有当 userId 存在时，才发起请求
        if (user.value.userId){
          fetchSessions()
        }
      };
      const fetchSessions = async () => {
        if (user.value.userId) {
          try {
            const response = await axios.get(`http://127.0.0.1:5000/api/sessions/${user.value.userId}`, {
              headers: {
                'Authorization': `Bearer ${user.value.access_token}`
              }
            });
            sessions.value = response.data; // 假设返回的数据是会话列表
          } catch (error) {
            console.error("Error fetching sessions:", error);
          }
        }
      };


      // 组件挂载时，获取用户数据和会话
      onMounted(fetchUserData);
      const selectSession = (session) => {
        if (selectedSessionId && session) {
          selectedSessionId.value = session.id;
          console.log(session.id)
          console.log(selectedSessionId.value)
        }
      };
      return { user, selectedSession,selectedSessionId, sessions,selectSession  };
    }
  };


  </script>

  <style>
  /* 容器的基本样式 */
  .chat-container {
    max-height: 80vh;
    height: 80vh;
    width: calc(150vh * 1.168); /* 宽度是高度的1.168倍 */
    background-color: #f5f5f5;
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
  /* 辅助信息容器样式 */
  .sidebar {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
    height: 95%; /* 辅助信息容器高度是聊天容器的80% */
    width: 25%; /* 辅助信息容器宽度是聊天容器的24% */
    position: absolute; /* 绝对定位 */
    top: 1.5vh; /* 与聊天容器顶部的间隔 */
    left: 4vh ; /* 与聊天容器左侧的间隔 */

  }
  /* 历史会话信息容器样式 */
  .chat-history {
    background-color: #ffffff; /* 亮白色背景，增加对比 */
    border: 1px solid #e1e1e1; /* 边框 */
    border-radius: 8px; /* 圆角边框 */
    height: 87%; /* 高度是辅助信息容器的80% */
    width: 96%; /* 宽度是辅助信息容器的90% */
    position: absolute; /* 绝对定位 */
    top: 0.5vh;
    left: 1vh;
  }
  .session-item{
    margin: 10px;
    background-color: #f0f0f0;
    text-align: center;
    font-size: 2vh; /* 设置字体大小 */
  }
  /* 账号信息容器样式 */
  .account-info {

    border-radius: 4vh; /* 圆角 */
    height: 10%; /* 高度是辅助信息容器剩余的20% */
    width: 96%; /* 宽度与历史会话信息相同 */
    position: absolute; /* 绝对定位 */

    bottom: 2.6vh; /* 底部与辅助信息容器的底部对齐 */
    left: 1vh; /* 左边距离辅助信息容器左边的50% */


  }
  /* 头像样式 */
  .user-profile-avatar {
    position: absolute;
    top: 0.75vh;
    left: 6vh;
    width: 6vh; /* 设置头像宽度 */
    height: 6vh; /* 设置头像高度 */
    border-radius: 100%; /* 圆形头像 */
    background-size: cover; /* 背景图片覆盖整个元素 */
    background-position: center; /* 背景图片居中 */
    margin-right: 1vh; /* 右边距 */
  }

  /* 用户 ID 样式 */
  .user-profile-id {
    position: absolute;
    top: 1vh;
    left: 15vh;
    font-size: 4vh; /* 设置字体大小 */
    color: #333; /* 字体颜色 */
  }
  /* 聊天消息区域样式 */
  .chat-messages {
    background-color: #ffffff; /* 亮白色背景，增加对比 */
    border: 1px solid #e1e1e1; /* 边框 */
    border-radius: 8px; /* 圆角边框 */
    height: 95%; /* 高度与辅助信息容器相同 */
    width: 70%;
    margin-left: 1vh; /* 与辅助容器的间隔*/
    overflow-y: auto; /* 超出部分可滚动 */
    position: absolute;
    top: 1.5vh; /* 与聊天容器顶部的间隔 */
    right: 2vh;

  }

  /* 辅助信息容器和聊天消息区域的共同父容器样式调整 */
  .chat-container {

    display: flex; /* 使用flex布局 */
    flex-direction: row; /* 横向布局 */
    align-items: stretch; /* 子元素高度拉伸以匹配容器高度 */
    justify-content: flex-start; /* 子元素从头开始排列 */
  }

  /* 辅助信息容器样式微调 */
  .sidebar {
    flex-basis: 25%; /* 基础宽度设置为24% */
    flex-shrink: 0; /* 不缩小宽度 */
    /* 其他样式保持不变 */
  }
  /* 消息查看区域样式 */
  .messages-list {

    height: 85%;
    width: 98%;
    position: absolute;
    top: 1vh;
    left: 1vh;
    right: 1vh;
    flex-grow: 2; /* 占据三分之二的空间 */
    overflow-y: auto; /* 超出部分可滚动 */
    /* 可以添加更多的样式，如背景色、字体等 */

  }

  /* 输入区域样式 */
  .input-area {
    height: 10%;
    width: 98%;
    position: absolute;
    left: 1vh;
    right: 1vh;
    bottom: 1vh;
    flex-grow: 1; /* 占据三分之一的空间 */
    display: flex; /* 使用flex布局 */
    justify-content: space-between; /* 元素之间保持间隔 */
    /* 可以添加更多的样式，如边框、背景色等 */



  }

  /* 输入框样式 */
  .input-area input {
    flex-grow: 1; /* 占据大部分空间 */
    border-radius: 20px; /* 更圆的边框 */
    border: 1px solid #e1e1e1; /* 边框 */
    /* 其他样式保持不变 */
    /* 可以添加更多的样式，如边框样式、字体大小等 */
  }

  /* 发送按钮样式 */
  .input-area button {
    position: absolute; /* 绝对定位 */
    right: 1vh; /* 右边距*/
    bottom: 1vh; /* 底边距*/
    /* 其他样式保持不变 */
    background-color: #4a90e2; /* 鲜艳的按钮背景色 */
    color: #ffffff; /* 按钮文字颜色 */
  }

  /* 为所有按钮添加一致的样式 */
  button {
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s; /* 鼠标悬停时变色 */
  }

  /* 鼠标悬停在按钮上时的样式 */
  button:hover {
    background-color: #3678d4; /* 按钮背景色变深 */
  }
  </style>
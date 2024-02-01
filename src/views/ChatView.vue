<template>
  <div class="chat-container">
    <div class="sidebar">

      <!-- 历史会话信息 -->
      <div class="chat-session">
        <div class="creatbuttom">
          <button @click="createNewSession" >创建会话</button>
        </div>
        <div>
          <div v-for="session in sessions" :key="session.id" class="session-item">
            <button @click="selectSession(session)">{{ session.title }}</button>
            <!--                <select @change="handleAction($event, session.id)">-->
            <!--                  <option value="">...</option>-->
            <!--                  <option value="rename">重命名</option>-->
            <!--                  <option value="delete">删除</option>-->
            <!--                </select>-->
          </div>
        </div>

      </div>


    </div>
    <!-- 账号信息 -->
    <div class="account-info">
      <span class="user-profile-id">{{ user.username }}</span>
      <!-- 账号信息内容 -->
    </div>

    <!-- 聊天消息区域 -->
    <div class="chat-messages">
      <!-- 消息列表 -->
      <div class="messages-list">
        <ChatHistory ref="chatHistory" :sessionId="selectedSessionId" :user="user" :shouldConnectWebSocket="shouldConnectWebSocket"  />
      </div>
      <!-- 输入框和发送按钮 -->
      <div class="input-area">
        <div class="response-select-container">
          <div class="response-select-label">回复：</div>
          <select id="responseSelect" v-model="selecteresponse">
            <option value="200">简单</option>
            <option value="400">普通</option>
            <option value="1000">详细</option>
            <option value="1500">非常详细</option>
          </select>
        </div>
        <div>
          <select id="modelSelect" v-model="selectedModel">
            <option value="GPT-3.5">GPT-3.5</option>
            <option value="GPT-4">GPT-4</option>
          </select>
        </div>

        <textarea
            v-model="messageContent"
            @keydown="handleKeydown"
            @input="adjustTextareaHeight"
            placeholder="输入消息，按 Enter 发送，Alt + Enter 换行"
        ></textarea>
        <button @click="sendMessage" :disabled="isSending">
          <font-awesome-icon v-if="isSending" :icon="['fas', 'circle-stop']" size="3x" style="color: #031539;" />
          <font-awesome-icon v-else icon="circle-arrow-up"  size="3x" style="color: #031539;" />
        </button>

      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted ,inject,provide } from 'vue';
import axios from 'axios';
import ChatHistory from '@/components/ChatHistory.vue';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import UserProfile from "@/components/UserProfile.vue";
import { v4 as uuidv4 } from 'uuid';

export default {
  components: {
    FontAwesomeIcon,
    UserProfile,
    ChatHistory,

  },
  setup({emit}) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const selectedModel = ref('GPT-3.5'); // 默认选择 GPT-3.5
    const selecteresponse =ref('200') ;// 500
    const user = ref({
      userId: localStorage.getItem('userId') || null,
      username: localStorage.getItem('username') || 'Unknown User',
      access_token: localStorage.getItem('access_token') || null
    });
    const sessions = ref([]);
    const messageContent = ref('');
    const selectedSession = ref(null);
    const selectedSessionId = ref(null);
    const isSending = ref(false);
    const sessionId = ref(null);
    const shouldConnectWebSocket = ref(false);
    const chatHistoryRef = ref(null);

    const shouldRefresh = ref(false);
    provide('shouldRefresh', shouldRefresh);

    const fetchUserData = () => {
      user.value.userId = localStorage.getItem('userId');
      user.value.username = localStorage.getItem('username') || 'Unknown User';
      user.value.access_token = localStorage.getItem('access_token');

      // 只有当 userId 存在时，才发起请求
      if (user.value.userId){
        fetchSessions()
      }
    };

    const resetTextareaHeight = (textarea) => {
      textarea.style.height = '40px';  // 重置为初始高度
    };

    const adjustTextareaHeight = (event) => {
      event.target.style.height = 'auto';  // 重置高度
      event.target.style.height = event.target.scrollHeight + 'px';  // 设置为滚动高度
    };

    const fetchSessions = async () => {
      if (user.value.userId) {
        try {
          const response = await axios.get(`${apiUrl}/chat/sessions/${user.value.userId}`, {
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
    const handleKeydown = (event) => {
      if (event.key === 'Enter' && event.altKey) {
        // 如果同时按下了 Alt 和 Enter，手动添加换行符
        event.preventDefault(); // 阻止默认行为
        const cursorPosition = event.target.selectionStart;
        const textBeforeCursor = messageContent.value.substring(0, cursorPosition);
        const textAfterCursor = messageContent.value.substring(cursorPosition);
        messageContent.value = textBeforeCursor + "\n" + textAfterCursor;
        // 将光标位置移动到插入的换行符后面
        event.target.selectionStart = cursorPosition + 1;
        event.target.selectionEnd = cursorPosition + 1;
      } else if (event.key === 'Enter') {
        // 只按了 Enter，没有按 Alt
        event.preventDefault(); // 阻止默认的换行行为
        sendMessage();
      }
    };


    const createNewSession = async () => {
      // 清空当前聊天记录


      // 构造POST请求的body
      const requestBody = {
        user_id: user.value.userId, // 用户ID
      };

      // 设置POST请求的headers
      const config = {
        headers: {
          'Authorization': `Bearer ${user.value.access_token}`, // JWT认证令牌
          'Content-Type': 'application/json' // 设置内容类型为 JSON
        }
      };

      // 调用后端接口获取新的会话信息
      try {
        const response = await axios.post(`${apiUrl}/chat/session/create`, requestBody, config);

        // 如果请求成功，处理新的会话信息
        if (response.data && response.data.session_id) {
          // 更新选中的会话ID
          selectedSessionId.value = response.data.session_id;
          // 这里可以添加代码以获取新会话的聊天记录或更新会话列表
          // 例如: fetchSessionRecords(selectedSessionId.value);
        }
      } catch (error) {
        console.error("Error creating new session:", error.response.data);
      }
    };

    const handleRename = (sessionId) => {
      // 添加处理重命名会话的逻辑
      console.log("Renaming session:", sessionId);
      // 可以调用API或其他逻辑来更新会话名称
    };

    const handleDelete = (sessionId) => {
      // 添加处理删除会话的逻辑
      console.log("Deleting session:", sessionId);
      // 可以调用API或其他逻辑来删除会话
    };

    const sendMessage = async () => {
      const trimmedMessageContent = messageContent.value.trim();
      if (trimmedMessageContent && !isSending.value) {
        isSending.value = true; // 开始发送，禁用发送按钮
        if (selectedSessionId.value === null) {
          selectedSessionId.value = uuidv4(); // 生成新的 session ID
        }
        console.log(selectedSessionId.value)

        try {
          if (!shouldConnectWebSocket.value) { // 假设您有一个变量来跟踪WebSocket连接状态
            shouldConnectWebSocket.value = true; // 更新WebSocket连接状态
            console.log(shouldConnectWebSocket.value)
            console.log(1)
          }
          console.log(2)
          // 构造请求体
          const requestBody = {
            user_id: user.value.userId,  // 发送者的用户ID
            session_id: selectedSessionId.value,  // 当前会话ID
            message: trimmedMessageContent,  // 消息内容
            gptmodel:selectedModel.value,
            gpttoken:selecteresponse.value
          };

          // 发送POST请求到后端
          const response = await axios.post(`${apiUrl}/chat/sendmessage`, requestBody, {
            headers: {
              'Authorization': `Bearer ${user.value.access_token}`  // 您的JWT令牌
            }
          });

          // 检查响应是否表示消息成功发送
          if (response.status === 200) {
            console.log("Message sent successfully", response.data);
            messageContent.value = ''; // 清空输入框
            resetTextareaHeight(document.querySelector('.input-area textarea')); // 重置 textarea 高度
            shouldRefresh.value = true; // 设置为 true，以便刷新消息记录
            await fetchSessions()
            // 假设新的 sessionId 在 response.data 中
            selectedSessionId.value= response.data.sessionid; // 确保与您的后端响应匹配
            console.log("New session ID:", selectedSessionId.value);

          } else {
            console.error("Failed to send message", response.data);
          }
        }

           catch (error) {
          console.error("Error sending message:", error);
        }finally {
          isSending.value = false;
          console.log("发送结束，允许再次发送")
        }
      }
    };



    // 组件挂载时，获取用户数据和会话
    onMounted(fetchUserData);
    const selectSession = (session) => {
      console.log("Session selected:", session);
      if (session && session.session_id) {
        selectedSessionId.value = session.session_id;
      }
    };



    return { user, selectedSession,selectedSessionId,messageContent, sessions,isSending,selectedModel,selecteresponse,shouldConnectWebSocket,selectSession,createNewSession ,sendMessage,handleKeydown,adjustTextareaHeight,handleDelete,handleRename,chatHistoryRef };
  }
};


</script>


<style>
/* 容器的基本样式 */
.chat-container {
  max-height: 100vh;
  height: 100vh;
  width: 100vw;
  box-shadow: 0 1vh 1vh rgba(0, 0, 0, 0.1); /* 轻微的阴影效果 */
  display: flex; /* 使用flex布局 */
  flex-direction: row; /* 横向布局 */
  align-items: center; /* 垂直居中子元素 */
  justify-content: center; /* 水平居中子元素 */
}
/* 辅助信息容器样式 */
.sidebar {
  height: 100%; /* 辅助信息容器高度是聊天容器的80% */
  width: 15%; /* 辅助信息容器宽度是聊天容器的24% */
  position: absolute; /* 绝对定位 */
  top: 0; /* 与聊天容器顶部的间隔 */
  left: 0; /* 与聊天容器左侧的间隔 */
  background-color: #031539;
}
/* 历史会话信息容器样式 */
.chat-session {
  border: 1px solid #181818;
  height: 90%; /* 高度是辅助信息容器的80% */
  width: 100%; /* 宽度是辅助信息容器的100% */
  padding-top: 1vh; /* 在顶部添加间隔 */
}
.session-item{
  margin: 1rem;
}
.session-item button {
  color: white; /* 按钮文字颜色 */
  /* 其他样式保持不变 */
}

.creatbuttom {
  /* 不要使用绝对定位，除非您需要它脱离正常文档流 */
  margin-bottom: 1vh; /* 创建会话按钮与下面元素的间隔 */
  text-align: center; /* 按钮文字居中 */
}
.creatbuttom button {
  min-height: 40px;  /* 初始最小高度 */
  max-height: 200px; /* 最大高度，超过此高度出现滚动条 */
  border-radius: 12px; /* 设置创建会话按钮的圆角 */
  padding: 10px 20px; /* 按钮内部的间隔 */
  border: none; /* 去除默认边框 */
  background-color: #031539; /* 按钮背景颜色 */
  color: white; /* 按钮文字颜色 */
  font-size: 2vh; /* 按钮文字大小 */
  cursor: pointer; /* 鼠标悬停时显示指针 */
  outline: none; /* 点击时不显示轮廓 */
  overflow-y: auto;  /* 超出部分显示滚动条 */
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 5px; /* 增加下划线与文本之间的间隔 */
}

/* 账号信息容器样式 */
.account-info {

  display: flex; /* 启用 Flexbox 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  border-radius: 4vh; /* 圆角 */
  height: 5%; /* 高度是辅助信息容器剩余的20% */
  width: 100%; /* 宽度与历史会话信息相同 */
  position: absolute; /* 绝对定位 */
  bottom: 0; /* 底部与辅助信息容器的底部对齐 */
}

/* 用户 ID 样式 */
.user-profile-id {
  position: absolute;
  left: 5vw;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  font-size: 4vh; /* 设置字体大小 */
  color: #ffffff; /* 字体颜色 */
}
/* 聊天消息区域样式 */
.chat-messages {
  background-color: #ffffff; /* 亮白色背景，增加对比 */
  border: 1px solid #e1e1e1; /* 边框 */
  height: 100%; /* 高度与辅助信息容器相同 */
  width: 85%;
  overflow-y: auto; /* 超出部分可滚动 */
  position: absolute;
  top: 0; /* 与聊天容器顶部的间隔 */
  right: 0;

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
  height: 93%;
  width: 99%;
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
  position: absolute; /* 设置相对定位 */
  height: 10%;
  width: 80%;
  bottom: 0;
  left: 5vw;
  display: flex; /* 使用flex布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}
.response-select-container {
  display: flex; /* 使用flex布局 */
  align-items: center; /* 垂直居中对齐 */
}

.response-select-label {
  margin-right: 0.5rem; /* 在标签和下拉框之间添加一些间隔 */
}
/* 输入框样式 */
.input-area textarea {
  flex-grow: 1; /* 占据大部分空间 */
  padding: 10px 80px 10px 10px; /* 右侧留出按钮的空间 */
  border-radius: 20px; /* 更圆的边框 */
  border: 1px solid #e1e1e1; /* 边框 */
  font-size: 16px; /* 文本大小 */
  box-sizing: border-box; /* 边框和内边距包含在宽度内 */
  height: 3rem; /* 给输入框一个固定的高度 */
  line-height: 1.5; /* 行高 */
  resize: none; /* 禁止调整大小 */
  overflow: hidden;

}

/* 发送按钮样式 */
.input-area button {
  position: absolute; /* 绝对定位 */
  right: 2vh; /* 右对齐 */
  top: 50%; /* 顶部对齐到中心 */
  transform: translateY(-50%); /* 垂直居中 */
  cursor: pointer; /* 鼠标指针 */
  outline: none; /* 去掉焦点时的轮廓线 */
  border: none; /* 去掉边框 */
  background: none; /* 移除背景色 */
  padding: 0; /* 移除内边距 */
  /* 其他样式保持不变 */

}
.session-item{

  padding-left: 10px; /* 内部向左留出空间 */
  margin: 20px;
  text-align: center;
  display: flex; /* 启用 Flexbox 布局 */
  align-items: center; /* 垂直居中对齐子元素 */
  justify-content: space-between; /* 子元素之间保持间隔 */
}
/* 为所有按钮添加一致的样式 */
.session-item button {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block; /* 或者使用 inline-block，取决于布局需求 */
  width: 90%; /* 或者设置一个固定的最大宽度如 max-width: 200px; */
  /* 确保按钮有足够的内边距显示文本 */
  padding: 0;
  font-size: .875rem;
  color:white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s; /* 鼠标悬停时变色 */
  background-color: transparent; /* 这应该确保没有背景色 */
  text-align: left; /* 文本靠左对齐 */
}
.session-item select {
  font-size: 1vh;
  -webkit-appearance: none; /* 针对 Safari、Chrome */
  -moz-appearance: none;    /* 针对 Firefox */
  appearance: none;         /* 标准写法，适用于未来的浏览器 */
  margin-right: 10px; /* 或根据你的设计调整 */
  color: white;
  width: 10%;
  text-align-last: center; /* 这将在多数现代浏览器上使选项文本居中 */
  position: absolute;
  right: 0;
  transform: translateY(-50%); /* 垂直居中 */
  border: none; /* 移除边框 */
  background-color: #031539; /* 设置背景色为黑色 */
}

/* 下拉框样式调整 */
.input-area select {
  font-size: 1.2em; /* 增大字体大小 */
  padding: 10px 15px; /* 增加内边距使下拉框更大 */
  margin-right: 20px; /* 在下拉框之间添加间隔 */
  border-radius: 5px; /* 轻微的圆角 */
  border: 1px solid #e1e1e1; /* 边框样式 */
}

/* 输入区域样式调整 */
.input-area {
  display: flex; /* 使用flex布局 */
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 元素之间平均分布空间 */
  padding: 10px; /* 增加内边距 */
  /* 其余样式保持不变 */
}
.response-select-label{
  font-size: 1.5rem;
}


</style>
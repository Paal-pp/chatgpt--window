<template>
  <div class="messages-list" ref="messagesList">
  <div v-for="record in records" :key="record.timestamp" class="chat-record">
    <div class="message-container sender">
      <!-- 使用 v-html 渲染 Markdown -->
      <p class="chat-message" v-html="markdownToHtml(record.message)"></p>
      <p class="chat-time">{{ formatTimestamp(record.timestamp) }}</p>
    </div>
    <div class="message-container receiver">
      <!-- 使用 v-html 渲染 Markdown -->
      <p class="chat-message" v-html="markdownToHtml(record.response)"></p>
      <p class="chat-time">{{ formatTimestamp(record.timestamp) }}</p>
    </div>
  </div>
  </div>
</template>

<script>
import { ref, watch,watchEffect ,inject,nextTick } from 'vue';
import axios from 'axios'; // 确保安装并导入了axios
import {marked} from 'marked'; // 导入 marked

export default {
  props: {
    sessionId: String,
    user: Object,
  },
  setup(props) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const records = ref([]); // 初始为空数组或根据需要设置初始值
    const totalPages = ref(0);
    const totalRecords = ref(0);
    const currentPage = ref(1);
    const messagesList = ref(null);
    const shouldRefresh =inject('shouldRefresh')

    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesList.value) {
          messagesList.value.scrollTop = messagesList.value.scrollHeight;
        }
      });
    };

    const printRecord = (record) => {
      console.log("test",record);
    };

    const markdownToHtml = (markdown) => {
      console.log(markdown)
      console.log(marked(markdown))
      return marked(markdown);
    };
// 获取会话记录的方法
    const fetchSessionRecords = async (page = 1, perPage = 100) => {
      try {
        // 如果没有提供sessionId，直接返回，不执行任何操作
        if (!props.sessionId) {
          console.log("No sessionId provided");
          return;
        }

        const url = `${apiUrl}/api/history/${props.sessionId}/${props.user.userId}`;
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${props.user.access_token}`
          }
        });
        if (response.data && response.data.records) {
          records.value = response.data.records; // 获取记录数组
          totalPages.value = response.data.pages; // 获取总页数
          totalRecords.value = response.data.total; // 获取总记录数
          currentPage.value = response.data.current_page; // 获取当前页码
          scrollToBottom();
        } else {
          // 处理数据不存在的情况
          console.error("No records found in the response");
        }
      } catch (error) {
        console.error("Error fetching session records:", error);
      }
    };

    // 定义 formatTimestamp 方法
    const formatTimestamp = (timestamp) => {
      console.log(timestamp)
      // 这里您可以根据需要定义时间格式化逻辑
      // 例如：返回一个简单的日期字符串
      const date = new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    watch(() => props.sessionId, (newId, oldId) => {
      if (newId !== oldId) {
        fetchSessionRecords();
      }
    }, { immediate: true });

// 对于 shouldRefresh 的 watch 保持不变
    watch(shouldRefresh, (newValue) => {
      if (newValue) {
        fetchSessionRecords();
        shouldRefresh.value = false; // 重置状态
      }
    }, { immediate: true });

    return {
      markdownToHtml,
      shouldRefresh,
      records,
      totalPages,
      totalRecords,
      currentPage,
      fetchSessionRecords,
      formatTimestamp,
      printRecord,
      messagesList};
  },
};
</script>
<style >
.message-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 18px;
  max-width: 100%; /* 让每条消息占据一整行 */
  word-break: break-word; /* 防止长文本溢出 */
}
.chat-record{

}
.sender {
  margin-bottom: 16px; /* 每条消息下方的间隔 */
  right: 1vh;
  align-self: flex-end;
  background-color: #f0f0f0;
  margin-left: auto; /* 将消息对齐到右边 */
  margin-right: 10px; /* 与右边界保持一定间距 */
}

.receiver {

  left: 1vh;
  align-self: flex-start;
  background-color: #dcf8c6;
  margin-left: 10px; /* 与左边界保持一定间距 */
  margin-right: auto; /* 将消息对齐到左边 */
}

.chat-message {

  margin: 0;
  font-size: 16px;
  line-height: 24px;
}

.chat-time {
  align-self: flex-end;
  font-size: 12px;
  color: #999999;
  margin-top: 8px;
}
</style>

<template>
  <div class="messages-list" ref="messagesList">
    <div v-for="record in records" :key="record.timestamp" class="chat-record">
      <!-- 发送者消息 -->
      <div v-if="record.message" :class="['message-container', 'sender', record.isNew ? 'new-message' : '']">
        <p class="chat-message" v-html="markdownToHtml(record.message)"></p>
        <p class="chat-time">{{ formatTimestamp(record.timestamp) }}</p>
      </div>

      <!-- 接收者消息 -->
      <div v-if="record.response" :class="['message-container', 'receiver', record.isNew ? 'new-message' : '']">
        <p class="chat-message" v-html="markdownToHtml(record.response)"></p>
        <p class="chat-time">{{ formatTimestamp(record.timestamp) }}</p>
      </div>
    </div>
  </div>
</template>


<script>
import {ref, watch, watchEffect, inject, nextTick, onBeforeUnmount} from 'vue';
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
    const timers = ref([]);
    let updateTimer = null;

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

          const oneMinuteAgo = Date.now() - 20000; // 当前时间的一分钟前
          records.value = response.data.records.map(record => {
            const isNew = new Date(record.timestamp).getTime() > oneMinuteAgo;
            if (isNew) {
              const timer = setTimeout(() => {
                record.isNew = false;
              }, 1000); // 5分钟后，定时器将isNew设置为false
              timers.value.push(timer);
            }
            return { ...record, isNew };
          });
          scrollToBottom();
          // ... 其他状态更新...
        } else {
          console.error("No records found in the response");
        }
      } catch (error) {
        console.error("Error fetching session records:", error);
      }
    };

    const updateRecordsStatus = () => {
      const oneMinuteAgo = Date.now() - 20000;
      for (const record of records.value) {
        if (new Date(record.timestamp).getTime() < oneMinuteAgo) {
          record.isNew = false; // 超过一分钟的消息不再标记为新
        }
      }
    };

    updateTimer = setInterval(updateRecordsStatus, 1000);

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

    onBeforeUnmount(() => {
      if (updateTimer) {
        clearInterval(updateTimer); // 清理定时器
      }
    });

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
  width: 40%;
  align-items: center; /* 垂直居中对齐 */

}
.chat-message span {
  margin: 0; /* 确保没有外边距 */
  padding: 0; /* 确保没有内边距 */
  display: inline; /* 保持行内元素的默认显示方式 */
}

.messages-list {
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中对齐 */
  width: 100%; /* 设置宽度为100%以允许子元素居中 */
  margin: 0 auto; /* 水平居中 */
}
.sender {
  font-size: 50px;
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
  margin-left: 10px; /* 与左边界保持一定间距 */
  margin-right: auto; /* 将消息对齐到左边 */
}

.chat-message {
  margin: 0;
  font-size: 1rem;
  line-height: 24px;
}

.chat-time {
  align-self: flex-end;
  font-size: 18px;
  color: #999999;
  margin-top :0;
  margin-bottom: 0;
}
.new-message {
  background-color: #e0f7fa; /* 选择一个突出的颜色 */
}
</style>

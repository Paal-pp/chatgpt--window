<template>
    <div v-for="record in records" :key="record.timestamp" class="chat-record">
      <div class="message-container sender">
        <p class="chat-message">{{ record.message }}</p>
        <p class="chat-time">{{ formatTimestamp(record.timestamp) }}</p>
      </div>
      <div class="message-container receiver">
        <p class="chat-message">{{ record.response }}</p>
        <p class="chat-time">{{ formatTimestamp(record.timestamp) }}</p>
      </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import axios from 'axios'; // 确保安装并导入了axios

export default {
  props: {
    sessionId: String,
    user: Object,
  },
  setup(props) {
    const records = ref([]); // 初始为空数组或根据需要设置初始值
    const totalPages = ref(0);
    const totalRecords = ref(0);
    const currentPage = ref(1);

    const printRecord = (record) => {
      console.log("test",record);
    };

// 获取会话记录的方法
    const fetchSessionRecords = async (page = 1, perPage = 10) => {
      try {
        const  url = `http://127.0.0.1:5000/api/history/${props.sessionId}/${props.user.userId}`
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
        } else {
          // 处理数据不存在的情况
          console.error("No records found in the response");}}
      catch (error) {
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

    watch(() => props.sessionId, (newId ,oldId) => {
      // 逻辑来处理新的会话ID
      if (newId != oldId) {
        fetchSessionRecords()
      }
    });

    return {       records,
      totalPages,
      totalRecords,
      currentPage,
      fetchSessionRecords,
      formatTimestamp,
      printRecord};
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
  position: absolute;
  right: 1vh;
  align-self: flex-end;
  background-color: #f0f0f0;
  margin-left: auto; /* 将消息对齐到右边 */
  margin-right: 10px; /* 与右边界保持一定间距 */
}

.receiver {
  margin-bottom: 16px; /* 每条消息下方的间隔 */
  position: absolute;
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

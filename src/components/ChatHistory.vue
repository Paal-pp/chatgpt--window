<template>
  <div v-for="record in records" :key="record.timestamp">
    <p>{{ record.message }}</p>
    <p>{{ record.response }}</p>
    <p>{{ formatTimestamp(record.timestamp) }}</p></div>
</template>

<script>
import { ref, watch } from 'vue';
import axios from 'axios'; // 确保安装并导入了axios

export default {
  props: {
    sessionId: String,
  },
  setup(props) {
    console.log("Current session ID in child:", props.sessionId);
    watch(() => props.sessionId, (newId) => {
      // 逻辑来处理新的会话ID
      console.log("New session ID in child:", newId);
    });

    return {  };
  },
};
</script>

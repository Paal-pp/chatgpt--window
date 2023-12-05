<template>
  <div>
    <!-- 显示聊天记录 -->
    <div v-for="record in records" :key="record.id">
      <p>{{ record.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedSessionId: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      records: [], // 存储聊天记录
    };
  },
  watch: {
    selectedSessionId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchRecords(newVal); // 当选中的会话ID变化时，获取新的聊天记录
      }
    }
  },
  methods: {
    fetchRecords(sessionId) {
      // 根据会话ID获取聊天记录的逻辑...
    }
  }
};
</script>

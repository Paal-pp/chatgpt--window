<template>
  <div class="chat-session">
    <div v-for="message in messages" :key="message.id">
      {{ message.content }}
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, toRefs } from 'vue';

export default defineComponent({
  props: {
    messages: Array
  },
  emits: ['sendMessage'],
  setup(props, { emit }) {
    const { messages } = toRefs(props);
    const newMessage = ref('');

    const sendMessage = () => {
      emit('sendMessage', newMessage.value);
      newMessage.value = ''; // Clear the input after sending
    };

    return { messages, newMessage, sendMessage };
  }
});
</script>

<style>
/* Add your CSS here */
</style>

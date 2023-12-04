<template>
  <div class="chat-history">
    <ul>
      <li v-for="session in sessions" :key="session.id" @click="selectSession(session.id)">
        {{ session.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
  props: {
    sessions: Array
  },
  emits: ['selectSession'],
  setup(props, { emit }) {
    const { sessions } = toRefs(props);

    const selectSession = (id) => {
      emit('selectSession', id);
    };

    return { sessions, selectSession };
  }
});
</script>

<style>
/* Add your CSS here */
</style>

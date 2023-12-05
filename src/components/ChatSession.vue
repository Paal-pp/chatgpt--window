<template>
  <div class="chat-session">
    <div v-for="session in sessions" :key="session.session_id">
      <h3>{{ session.title }}</h3>
      <p>Last updated: {{ session.last_updated }}</p>
    </div>
  </div>
</template>

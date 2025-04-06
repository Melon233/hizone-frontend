<script setup>
import { ref } from 'vue'
</script>
<template>
  <div>
    <div class="head">
      <img class="back-btn" @click="handleBack" src="/public/back.svg" />
      <span class="title">发布</span>
    </div>
  </div>
</template>
<style scoped>
.head {
  border-bottom: 1px solid var(--dark-gray);
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  height: 60px;
}
.back-btn {
  cursor: pointer;
  margin: 10px;
  width: 20px;
  height: 20px;
}
.title {
  font-size: 20px;
}
</style>

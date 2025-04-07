<script setup>
import { ref } from 'vue'
import router from '@/router'
import client from '@/client/client.js'
import cookie from 'js-cookie'
import { getAvatarUrl } from '@/utility/utility.js'
import { jwtDecode } from 'jwt-decode'
const showLoginPopup = ref(false) // 登录弹窗状态
const showRegisterPopup = ref(false) // 注册弹窗状态
const openLoginPopup = () => {
  showLoginPopup.value = true
  showRegisterPopup.value = false
}
const closeLoginPopup = () => {
  showLoginPopup.value = false
  showRegisterPopup.value = false
  console.log('close')
}
const loginForm = ref({
  email: '',
  check_code: '',
})

const login = async () => {
  const res = await client.login.post('/login', loginForm.value)
  if (res.data !== 'error') {
    cookie.set('token', res.data)
    cookie.set('user_id', jwtDecode(res.data).user_id)
    closeLoginPopup()
    window.location.reload()
  }
}

const handleAvatarClick = () => {
  if (cookie.get('user_id') != null) {
    router.push('/profile')
  } else {
    console.log('not login')
    openLoginPopup()
  }
}
const loadAvatar = () => {
  if (cookie.get('user_id') != null) {
    return getAvatarUrl(cookie.get('user_id'))
  } else {
    return '/public/offline.png'
  }
}
const sendCheckCode = async () => {
  const res = await client.login.post('/sendCheckCode', {
    email: loginForm.value.email,
  })
  console.log(res.data)
  if (res.data === 'success') {
    alert('验证码已发送')
  }
}
const keyword = ref('')
const search = async () => {
  console.log(keyword.value)
  const res = await client.search.get('/searchPost', {
    params: {
      keyword: keyword.value,
    },
  })
  console.log(res.data)
}
</script>
<template>
  <div id="root">
    <div class="left-side-bar">
      <div class="tab-list">
        <div class="tab-container">
          <button id="post-btn" @click="router.push('/post')">发布</button>
        </div>
        <div class="tab-container">
          <img class="avatar" @click="handleAvatarClick" :src="loadAvatar()" alt="avatar" />
        </div>
      </div>
    </div>
    <router-view class="main-content" v-slot="{ Component }">
      <keep-alive include="Push">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <!-- <router-view class="main-content" /> -->

    <div class="right-side-bar">
      <div class="tab-list">
        <div class="tab-container">
          <div>
            <input v-model="keyword" type="text" placeholder="搜索" />
          </div>
          <button id="post-btn" @click="search()">搜索</button>
        </div>
      </div>
    </div>
  </div>
  <div class="overlay" v-show="showLoginPopup"></div>
  <transition name="fade">
    <form class="popup" @submit.prevent="login" v-show="showLoginPopup">
      <img class="close-icon" @click="closeLoginPopup" src="/public/close.svg" width="24" height="24" alt="close" />
      <img class="login-image" src="/public/login-logo.png" alt="login-bg" />
      <div class="input-container">
        <input class="login-input" v-model="loginForm.email" type="text" placeholder="请输入邮箱" />
      </div>
      <div class="input-container">
        <input class="check-code-input" v-model="loginForm.check_code" type="text" placeholder="请输入验证码" />
        <button class="check-code-btn" type="button" @click="sendCheckCode">获取验证码</button>
      </div>
      <button class="login-btn" type="submit">登录</button>
      <!-- <button class="register-btn" type="button" @click="openRegisterPopup">注册</button> -->
    </form>
  </transition>
</template>
<style scoped>
#root {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
}

#post-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--dark);
  display: flex;
  border: 2px solid var(--dark-gray);
  justify-content: center;
  align-items: center;
}

#logo {
  background-image: url('/public/logo.png');
  background-attachment: local;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 110px;
  height: 36px;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 999px;
  cursor: pointer;
}
.left-side-bar {
  position: sticky;
  padding-top: 60px;
  top: 0px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: end;
}
.right-side-bar {
  position: sticky;
  padding-top: 60px;
  top: 0px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: start;
}
.main-content {
  width: 600px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-left: 1px solid var(--dark-gray);
  border-right: 1px solid var(--dark-gray);
  /* min-height: 110vh; */
}
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--dark);
  border-radius: 16px;
  border: 2px solid var(--dark-gray);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 11;
}
.login-image {
  width: 368px;
  height: 102px;
  margin: 42px 0 20px 0;
}
input {
  width: 340px;
  height: 40px;
  padding: 0;
  margin-left: 12px;
  border-radius: 8px;
  font-size: 18px;
  background-color: var(--dark);
  border: none;
  outline: none;
}
.login-btn {
  width: 370px;
  height: 55.6px;
  background-color: var(--cyan);
  border: none;
  border-radius: 999px;
  font-size: 20px;
  margin: 20px;
}
.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.tab-list {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
}
.tab-container {
  width: 50px;
  height: 50px;
  margin-bottom: 15px;
}
.input-container {
  width: 368px;
  height: 55.6px;
  margin: 10px;
  border-radius: 999px;
  font-size: 18px;
  background-color: var(--dark);
  border: 1px solid var(--dark-gray);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.check-code-btn {
  width: 140px;
  height: 40px;
  padding: 0;
  background-color: var(--dark);
  border: none;
  border-radius: 999px;
  font-size: 18px;
  color: var(--cyan);
}
.check-code-input {
  width: 200px;
  height: 40px;
  padding: 0;
  margin-left: 12px;
  border-radius: 8px;
  font-size: 18px;
  background-color: var(--dark);
  border: none;
  outline: none;
}
.login-input {
  width: 340px;
  height: 40px;
  padding: 0;
  margin-left: 12px;
  border-radius: 8px;
  font-size: 18px;
  background-color: var(--dark);
  border: none;
  outline: none;
}
.back-icon {
  position: absolute;
  top: 10px;
  left: 10px;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 透明黑色背景 */
  backdrop-filter: blur(5px); /* 模糊效果，可选 */
  z-index: 10; /* 确保遮罩层在上层 */
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import cookie from 'js-cookie'
import router from '@/router'
import { getAvatarUrl, addFollow, deleteFollow } from '@/utility/utility'
import client from '@/client/client.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const logout = () => {
  cookie.remove('token')
  cookie.remove('user_id')
  console.log('logout')
  router.push('/')
}
const userDetail = ref({
  collect_count: 0,
  email: '',
  fan_count: 0,
  follow_count: 0,
  liked_count: 0,
  nickname: '',
  post_count: 0,
  register_time: '',
  user_id: route.params.userId,
})

const getUserDetail = async () => {
  const res = await client.user.get('/getUserDetail', {
    params: { user_id: route.params.userId },
    headers: {
      Token: cookie.get('token'),
    },
  })
  if (res.data !== null) {
    console.log(res.data)
    userDetail.value = res.data
  }
}
const showEditPopup = ref(false)
const openEditPopup = () => {
  showEditPopup.value = true
}
const closeEditPopup = () => {
  showEditPopup.value = false
}
const saveEdit = async () => {
  const res = await client.user.post('/updateUserInfo', {
    user_id: route.params.userId,
    nickname: userDetail.value.nickname,
  })
  if (res.data === 'success') {
    // 刷新页面
    window.location.reload()
  } else {
    alert('修改失败', res.data)
  }
}
const cancelEdit = () => {
  showEditPopup.value = false
}
const handleFollowClicked = async (followed, userId) => {
  if (followed) {
    if (await deleteFollow(userId)) {
      userDetail.value.fan_count -= 1
      userDetail.value.followed = false
    }
  } else {
    if (addFollow(userId)) {
      userDetail.value.fan_count += 1
      userDetail.value.followed = true
    }
  }
}
onMounted(() => {
  getUserDetail()
})
</script>
<template>
  <div>
    <div class="head">
      <img class="back-btn" @click="router.back" src="/arrow-left.svg" />
      <span class="title">{{ userDetail.nickname }}</span>
    </div>
    <div class="head-block">
      <div class="bg-container"></div>
      <img class="avatar" :src="getAvatarUrl(route.params.userId)" />
      <button class="follow-btn" @click="handleFollowClicked(userDetail.followed, userDetail.user_id)" v-if="userDetail.user_id != cookie.get('user_id')">
        {{ userDetail.followed ? '已关注' : '关注' }}
      </button>

      <button class="edit-btn" @click="openEditPopup" v-if="userDetail.user_id == cookie.get('user_id')">编辑个人资料</button>
      <button class="logout-btn" @click="logout" v-if="userDetail.user_id == cookie.get('user_id')">登出</button>

      <div class="user-info">
        <div style="font-size: 20px">{{ userDetail.nickname }}</div>
        <div>{{ userDetail.follow_count }} 关注</div>
        <div>{{ userDetail.fan_count }} 粉丝</div>
        <div>{{ userDetail.post_count }} 帖子</div>
        <div>{{ userDetail.collect_count }} 收藏</div>
        <div>{{ userDetail.liked_count }} 收到的喜欢</div>
      </div>
    </div>
    <div class="content-block"></div>
    <div class="edit-popup" v-if="showEditPopup">
      <div class="popup-header">
        <span>编辑个人资料</span>
        <img class="close-icon" @click="closeEditPopup" src="/close.svg" width="24" height="24" alt="close" />
      </div>
      <div class="avatar-container">
        <img id="edit-avatar" :src="getAvatarUrl(route.params.userId)" />
      </div>
      <div class="text-container">
        <span class="label">昵称</span>
        <input type="text" v-model="userDetail.nickname" placeholder="请输入新的用户名" />
      </div>
      <!-- <div class="text-container">
        <span class="label">签名</span>
        <input type="text" v-model="userDetail.description" placeholder="请输入新的用户名" />
      </div> -->
      <div class="btn-container">
        <button class="save-btn" @click="saveEdit">保存</button>
        <button class="cancel-btn" @click="cancelEdit">取消</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.head-block {
  position: relative;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--dark-gray);
  box-sizing: border-box;
}
.head {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid var(--dark-gray);
  height: 60px;
}
.back-btn {
  cursor: pointer;
  margin: 10px;
  width: 24px;
  height: 24px;
}
.title {
  font-size: 20px;
}
.bg-container {
  background-color: rgb(51, 54, 57);
  height: 200px;
}
.bg-container {
  position: relative;
}
.avatar {
  position: absolute;
  top: 120px;
  left: 20px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}
.content-block {
  box-sizing: border-box;
  min-height: 1000px;
}
.user-info {
  margin: 100px 20px 0 20px;
}
.edit-btn {
  position: absolute;
  top: 260px;
  right: 20px;
  background-color: #080808;
  border: 1px solid #2f3336;
  border-radius: 999px;
  color: inherit;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 10px 16px;
}
.logout-btn {
  position: absolute;
  top: 320px;
  right: 20px;
  background-color: #080808;
  border: 1px solid #2f3336;
  border-radius: 999px;
  color: inherit;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 10px 16px;
}
.edit-popup {
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 448px;
  height: auto;
  background-color: #080808;
  border-radius: 16px;
  border: 2px solid #2f3336;
  align-items: center;
  justify-content: center;
}
#edit-avatar {
  width: 50px;
  height: 50px;
  margin: 5px 0;
  background-color: #686864;
  border-radius: 25px;
  cursor: pointer;
}
.close-icon {
  position: absolute;
  top: 8px;
  right: 10px;
  cursor: pointer;
}
.popup-header {
  margin: 10px 0;
}
.text-container {
  margin: 2px 0;
  /* padding: 0 20px; */
  width: 320px;
  height: 40px;
  background-color: #080808;
  border: 1px solid #686864;
  border-radius: 999px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
}
input {
  width: 240px;
  /* height: 40px; */
  padding: 0;
  /* margin: 10px; */
  /* border-radius: 8px; */
  font-size: 16px;
  background-color: #080808;
  border: none;
  outline: none;
  color: #ffffff;
}
.label {
  margin: 0 15px;
}
.save-btn {
  background-color: #1d9bf0;
  border: none;
  border-radius: 999px;
  font-size: 18px;
  color: inherit;
  margin: 10px 30px;
  padding: 5px 20px;
  cursor: pointer;
}
.cancel-btn {
  /* background-color: #686864; */
  background-color: var(--light-gray);

  border: none;
  border-radius: 999px;
  font-size: 18px;
  color: inherit;
  margin: 10px 30px;
  padding: 5px 20px;
  cursor: pointer;
}
.btn-container {
  margin: 2px 0;
  /* padding: 0 20px; */
  width: 320px;
  height: 40px;
  background-color: #080808;
  /* border: 1px solid #686864; */
  border-radius: 999px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.follow-btn {
  position: absolute;
  top: 260px;
  right: 20px;
  background-color: #080808;
  border: 1px solid #2f3336;
  border-radius: 999px;
  color: inherit;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 10px 16px;
}
</style>

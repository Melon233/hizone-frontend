<script setup>
import { ref, onMounted } from 'vue'
import client from '/src/client/client'
import cookie from 'js-cookie'
import { getAvatarUrl } from '@/utility/utility'
import router from '@/router'
const pushList = ref([]) // 帖子列表
const newList = ref([]) // 最新列表
const selectedTab = ref('push')

const getPush = async () => {
  const res = await client.post.get('/getPush', {
    headers: {
      Token: cookie.get('token'),
    },
  })
  if (res.data !== null) {
    console.log(res.data)
    pushList.value = res.data
  }
}
const getNew = async () => {}
const extractTime = time => {
  const date = new Date(time)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}
const likePost = async postId => {
  const res = await client.interaction.post('/likePost', {
    post_id: postId,
    sender_id: cookie.get('user_id'),
  })
  const post = pushList.value.find(item => item.post_id === postId)
  if (res.data === 'success') {
    post.liked = true
    post.like_count += 1
    console.log('点赞成功', post)
  } else {
    post.liked = false
    console.log('点赞失败', res.data)
  }
}
const collectPost = async postId => {
  const res = await client.interaction.post('/collectPost', {
    post_id: postId,
    sender_id: cookie.get('user_id'),
  })
  const post = pushList.value.find(item => item.post_id === postId)
  if (res.data === 'success') {
    post.collected = true
    post.collect_count += 1
    console.log('收藏成功', post)
  } else {
    post.collected = false
    console.log('收藏失败', res.data)
  }
}
const getLikeIcon = postId => {
  const post = pushList.value.find(item => item.post_id === postId)
  if (post.liked) {
    return '/public/like-true.svg'
  } else {
    return '/public/like-false.svg'
  }
}
const getCollectIcon = postId => {
  const post = pushList.value.find(item => item.post_id === postId)
  if (post.collected) {
    return '/public/collect-true.svg'
  } else {
    return '/public/collect-false.svg'
  }
}
const cancelLikePost = async postId => {
  const res = await client.interaction.post('/cancelLikePost', {
    post_id: postId,
    sender_id: cookie.get('user_id'),
  })
  const post = pushList.value.find(item => item.post_id === postId)
  if (res.data === 'success') {
    post.liked = false
    post.like_count -= 1
    console.log('取消点赞成功', post)
  } else {
    console.log('取消点赞失败', res.data)
  }
}
const cancelCollectPost = async postId => {
  const res = await client.interaction.post('/cancelCollectPost', {
    post_id: postId,
    sender_id: cookie.get('user_id'),
  })
  const post = pushList.value.find(item => item.post_id === postId)
  if (res.data === 'success') {
    post.collected = false
    post.collect_count -= 1
    console.log('取消收藏成功', post)
  } else {
    console.log('取消收藏失败', res.data)
  }
}
const handleLikePostClicked = postId => {
  if (cookie.get('token') == null) {
    alert('请先登录')
    return
  }
  const post = pushList.value.find(item => item.post_id === postId)
  if (post.liked) {
    cancelLikePost(postId)
  } else {
    likePost(postId)
  }
}
const handleCollectPostClicked = postId => {
  if (cookie.get('token') == null) {
    alert('请先登录')
    return
  }
  const post = pushList.value.find(item => item.post_id === postId)
  if (post.collected) {
    cancelCollectPost(postId)
  } else {
    collectPost(postId)
  }
}
const handleTabSelected = tab => {
  selectedTab.value = tab
  if (tab === 'push') {
    getPush()
  } else if (tab === 'new') {
    getNew()
  }
}
onMounted(() => {
  getPush()
})
</script>
<template>
  <div>
    <div class="head-bar">
      <div class="item-container" @click="handleTabSelected('push')">
        <div class="head-bar-item">
          <span>推荐</span>
          <div class="selection-indicator" v-show="selectedTab === 'push'"></div>
        </div>
      </div>
      <div class="item-container" @click="handleTabSelected('new')">
        <div class="head-bar-item">
          <span>关注</span>
          <div class="selection-indicator" v-show="selectedTab === 'new'"></div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="push-list" v-show="selectedTab === 'push'">
        <div class="block" v-for="post in pushList" :key="post.post_id">
          <div class="avatar-col">
            <div class="avatar-container">
              <img class="avatar" :src="getAvatarUrl(post.author_id)" alt="avatar" width="50" height="50" />
            </div>
          </div>
          <div class="data">
            <div class="meta-bar">
              <div class="meta-left">
                <div class="name">{{ post.author_name }}</div>
                <div class="time">{{ extractTime(post.post_time) }}</div>
              </div>
              <div class="meta-right">
                <div class="follow-btn">
                  <img class="option-icon" src="/public/option.svg" />
                </div>
              </div>
            </div>
            <div class="text-container" v-html="post.post_content" @click="router.push({ name: 'Detail', params: { postId: post.post_id } })"></div>
            <div class="metrics">
              <div class="metric">
                <img class="icon" @click="handleLikePostClicked(post.post_id)" :src="getLikeIcon(post.post_id)" alt="icon" width="16" height="16" />
                <div class="value">{{ post.like_count }}</div>
              </div>
              <div class="metric">
                <img class="icon" @click="router.push({ name: 'Detail', params: { postId: post.post_id } })" src="/public/comment.svg" alt="icon" width="18" height="18" />
                <div class="value">{{ post.comment_count }}</div>
              </div>
              <div class="metric">
                <img class="icon" @click="handleCollectPostClicked(post.post_id)" :src="getCollectIcon(post.post_id)" alt="icon" width="16" height="16" />
                <div class="value">{{ post.collect_count }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="new-list" v-show="selectedTab === 'new'"></div>
    </div>
  </div>
</template>
<style scoped>
.head-bar {
  position: fixed;
  width: 598.4px;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid var(--dark-gray);
  height: 60px;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
}
.block {
  border-bottom: 1px solid var(--dark-gray);
  box-sizing: border-box;
  padding: 8px;
  display: flex;
  flex-direction: row;
}
.avatar-col {
  margin-right: 10px;
  width: 50px;
}
.avatar-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.avatar {
  border-radius: 50%;
}
.data {
  flex: 1;
}
.meta-bar {
  display: flex;
  flex-direction: row;
  height: min-content;
  margin-bottom: 2px;
}
.meta-left {
  flex: 1;
  display: flex;
  flex-direction: row;
}
.meta-right {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}
.name {
  margin: 0 10px 0 0;
}
.time {
  color: var(--light-gray);
}
.text {
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.vertical-image {
  width: 382.5px;
  height: 510px;
  object-fit: cover;
  border-radius: 10px;
  margin: 10px 0 0 0;
}
.horizontal-image {
  width: 516.8px;
  height: 269.25px;
  object-fit: cover;
  border-radius: 10px;
  margin: 10px 0 0 0;
}
.metrics {
  display: flex;
  flex-direction: row;
}
.metric {
  display: flex;
  flex-direction: row;
  margin-right: 20px;
  color: var(--light-gray);
  align-items: center;
}

.icon {
  margin-right: 5px;
  cursor: pointer;
}
.selection-indicator {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 4px;
  border-radius: 10px;
  background-color: var(--blue);
}

.item-container {
  flex: 1;
  display: flex;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}
.item-container:hover {
  background-color: rgba(24, 24, 24, 0.5);
}
.head-bar-item {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}
.option-icon {
  height: 75%;
  cursor: pointer;
  transition-duration: 0.2s;
}
.option-icon:hover {
  background-color: rgba(10, 23, 31, 0.5);
}
.follow-btn {
  position: absolute;
  aspect-ratio: 1/1;
  height: 150%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.follow-btn:hover {
  background-color: rgb(10, 23, 31);
  border-radius: 50%;
  transition-duration: 0.2s;
}
.text-container {
  cursor: pointer;
}
.content {
  margin-top: 60px;
  min-height: 100vh;
}
</style>

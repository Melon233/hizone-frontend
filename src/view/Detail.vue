<script setup>
import { nextTick, onActivated, onMounted, ref } from 'vue'
import client from '@/client/client.js'
import cookie from 'js-cookie'
import { getAvatarUrl } from '@/utility/utility.js'
import router from '@/router'
import { useRoute } from 'vue-router'
const route = useRoute()
const post = ref({})
const commentEditor = ref(null)
const commentList = ref([])
const replyList = ref([])
const parentCommentId = ref(null)
const getPost = async () => {
  const res = await client.post.get('/getPost', {
    params: {
      post_id: route.params.postId,
    },
    headers: {
      Token: cookie.get('token'),
    },
  })
  if (res.data != null) {
    post.value = res.data
    console.log(res.data)
  } else {
    console.log('获取帖子失败', res.data)
  }
}
const getCommentList = async () => {
  const res = await client.comment.get('/getCommentList', {
    params: {
      post_id: route.params.postId,
    },
    headers: {
      Token: cookie.get('token'),
    },
  })
  if (res.data === null) {
    console.log('获取评论失败', res.data)
  } else {
    commentList.value = res.data
    console.log(res)
  }
}
const getReplyList = async comment => {
  const res = await client.comment.get('/getReplyList', {
    params: {
      parent_comment_id: comment.comment_id,
    },
    headers: {
      Token: cookie.get('token'),
    },
  })
  if (res.data !== null) {
    console.log(comment)
    if (!comment.reply_list) {
      comment.reply_list = []
    }
    comment.reply_list = res.data
    console.log(comment.reply_list)
  } else {
    console.log('获取评论失败', res.data)
  }
}
const extractTime = time => {
  const date = new Date(time)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}
const likePost = async post => {
  const res = await client.interaction.post('/likePost', {
    post_id: post.post_id,
    sender_id: cookie.get('user_id'),
  })
  if (res.data === 'success') {
    post.liked = true
    post.like_count += 1
    console.log('点赞成功', post)
  } else {
    console.log('点赞失败', res.data)
  }
}
const collectPost = async post => {
  const res = await client.interaction.post('/collectPost', {
    post_id: post.post_id,
    sender_id: cookie.get('user_id'),
  })
  if (res.data === 'success') {
    post.collected = true
    post.collect_count += 1
    console.log('收藏成功', post)
  } else {
    console.log('收藏失败', res.data)
  }
}
const getLikeIcon = liked => {
  if (liked) {
    return '/public/like-true.svg'
  } else {
    return '/public/like-false.svg'
  }
}

const getCollectIcon = () => {
  if (post.value.collected) {
    return '/public/collect-true.svg'
  } else {
    return '/public/collect-false.svg'
  }
}
const cancelLikePost = async post => {
  const res = await client.interaction.post('/cancelLikePost', {
    post_id: post.post_id,
    sender_id: cookie.get('user_id'),
  })
  if (res.data === 'success') {
    post.liked = false
    post.like_count -= 1
    console.log('取消点赞成功', post)
  } else {
    console.log('取消点赞失败', res.data)
  }
}
const cancelCollectPost = async post => {
  const res = await client.interaction.post('/cancelCollectPost', {
    post_id: post.post_id,
    sender_id: cookie.get('user_id'),
  })
  if (res.data === 'success') {
    post.collected = false
    post.collect_count -= 1
    console.log('取消收藏成功', post)
  } else {
    console.log('取消收藏失败', res.data)
  }
}
const handleLikePostClicked = post => {
  if (cookie.get('token') == null) {
    alert('请先登录')
    return
  }
  if (post.liked) {
    cancelLikePost(post)
  } else {
    likePost(post)
  }
}
const handleReplyListClicked = comment => {
  if (comment.reply_unfold) {
    comment.reply_unfold = false
    return
  }
  comment.reply_unfold = true
  if (!comment.reply_list) {
    getReplyList(comment)
  }
}
const handleCollectPostClicked = post => {
  if (cookie.get('token') == null) {
    alert('请先登录')
    return
  }
  if (post.collected) {
    cancelCollectPost(post)
  } else {
    collectPost(post)
  }
}

const backToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
const sendComment = async () => {
  const res = await client.comment.post('/sendComment', {
    sender_id: cookie.get('user_id'),
    comment_content: commentEditor.value.innerHTML,
    post_id: post.value.post_id,
  })
  if (res.data != null) {
    commentList.value.push(res.data)
    commentEditor.value.innerHTML = ''
    post.value.comment_count += 1
    console.log('评论成功', res.data)
  } else {
    alert('评论失败')
  }
}
const sendReply = async comment => {
  const replyEditor = document.getElementById('reply-edior' + comment.comment_id)
  const res = await client.comment.post('/sendReply', {
    sender_id: cookie.get('user_id'),
    reply_content: replyEditor.innerHTML,
    post_id: post.value.post_id,
    parent_comment_id: comment.comment_id,
  })
  if (res.data != null) {
    replyList.value.push(res.data)
    replyEditor.innerHTML = ''
    post.value.comment_count += 1
    comment.reply_count += 1
    if (comment.reply_list) {
      comment.reply_list.push(res.data)
    }
    console.log('回复成功', res.data)
  } else {
    alert('回复失败')
  }
}
const likeComment = async comment => {
  const res = await client.comment.post('/likeComment', {
    post_id: post.value.post_id,
    sender_id: cookie.get('user_id'),
    comment_id: comment.comment_id,
  })
  if (res.data === 'success') {
    comment.liked = true
    comment.comment_like_count += 1
    console.log('点赞成功', comment)
  } else {
    console.log('点赞失败', res.data)
  }
}
const likeReply = async reply => {
  const res = await client.comment.post('/likeReply', {
    post_id: post.value.post_id,
    sender_id: cookie.get('user_id'),
    reply_id: reply.reply_id,
    parent_comment_id: reply.parent_comment_id,
  })

  if (res.data === 'success') {
    reply.liked = true
    reply.reply_like_count += 1
    console.log('点赞成功', reply)
  } else {
    console.log('点赞失败', res.data)
  }
}
const cancelLikeComment = async comment => {
  const res = await client.comment.post('/cancelLikeComment', {
    post_id: post.value.post_id,
    sender_id: cookie.get('user_id'),
    comment_id: comment.comment_id,
  })
  if (res.data === 'success') {
    comment.liked = false
    comment.comment_like_count -= 1
    console.log('取消点赞成功', comment)
  } else {
    console.log('取消点赞失败', res.data)
  }
}
const cancelLikeReply = async reply => {
  const res = await client.comment.post('/cancelLikeReply', {
    post_id: post.value.post_id,
    sender_id: cookie.get('user_id'),
    reply_id: reply.reply_id,
    parent_comment_id: reply.parent_comment_id,
  })
  if (res.data === 'success') {
    reply.liked = false
    reply.reply_like_count -= 1
    console.log('取消点赞成功', reply)
  } else {
    console.log('取消点赞失败', res.data)
  }
}
const handleLikeCommentClicked = comment => {
  if (cookie.get('token') == null) {
    alert('请先登录')
    return
  }
  if (comment.liked) {
    cancelLikeComment(comment)
  } else {
    likeComment(comment)
  }
}
const handleLikeReplyClicked = reply => {
  if (cookie.get('token') == null) {
    alert('请先登录')
    return
  }
  if (reply.liked) {
    cancelLikeReply(reply)
  } else {
    likeReply(reply)
  }
}
const handleReplyClicked = async commentId => {
  if (parentCommentId.value == commentId) {
    parentCommentId.value = null
  } else {
    parentCommentId.value = commentId
    await nextTick()
    document.getElementById('reply-edior' + commentId).focus()
  }
}

const deleteReply = async comment => {}
const deleteComment = async comment => {}
const loadAvatar = () => {
  if (cookie.get('user_id') != null) {
    return getAvatarUrl(cookie.get('user_id'))
  } else {
    return '/public/offline.png'
  }
}
onMounted(() => {
  getPost()
  getCommentList()
  window.scrollTo({
    top: 0,
  })
})
// onActivated(() => {
//   window.scrollTo({
//     top: 0,
//   })
// })
</script>
<template>
  <div>
    <div class="head">
      <img class="back-btn" @click="router.push({ name: 'Home' })" src="/public/arrow-left.svg" width="24" height="24" />
      <span class="title">帖子</span>
      <img class="to-top-btn" @click="backToTop" src="/public/arrow-up.svg" width="24" height="24" />
    </div>
    <div class="block">
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
          <div class="metric" @click="handleLikePostClicked(post)">
            <img class="icon" :src="getLikeIcon(post.liked)" alt="icon" width="16" height="16" />
            <div class="value">{{ post.like_count }}</div>
          </div>
          <div class="metric">
            <img class="icon" src="/public/comment.svg" alt="icon" width="18" height="18" />
            <div class="value">{{ post.comment_count }}</div>
          </div>
          <div class="metric" @click="handleCollectPostClicked(post)">
            <img class="icon" :src="getCollectIcon(post.post_id)" alt="icon" width="16" height="16" />
            <div class="value">{{ post.collect_count }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="comment-sender">
      <img class="avatar" :src="loadAvatar()" alt="avatar" />
      <div class="comment-edior" ref="commentEditor" contenteditable="true"></div>
      <button class="comment-btn" @click="sendComment">评论</button>
    </div>
    <div class="comment-block">
      <div class="empty-indicator" v-show="commentList.length === 0">这里期待你的第一条评论！</div>
      <div class="comment-container" v-for="comment in commentList" :key="comment.comment_id">
        <img class="avatar" :src="getAvatarUrl(comment.sender_id)" alt="avatar" />
        <div class="nav-right">
          <div class="user-data">
            <div class="name">{{ comment.sender_id }}</div>
            <div class="time">{{ comment.comment_time }}</div>
          </div>
          <div class="text" v-html="comment.comment_content"></div>
          <div class="metrics">
            <div class="metric" @click="handleLikeCommentClicked(comment)">
              <img class="icon" :src="getLikeIcon(comment.liked)" alt="icon" width="16" height="16" />
              <div class="value">{{ comment.comment_like_count }}</div>
            </div>
            <div class="metric" @click="handleReplyListClicked(comment)">
              <img class="icon" src="/public/comment.svg" alt="icon" width="18" height="18" />
              <div class="value">{{ comment.reply_count }}</div>
            </div>
            <div class="metric" @click="handleReplyClicked(comment.comment_id)">回复</div>
          </div>
          <div class="reply-sender" v-show="parentCommentId === comment.comment_id">
            <img class="avatar" :src="loadAvatar()" alt="avatar" width="50" height="50" />
            <div class="comment-edior" :id="'reply-edior' + comment.comment_id" contenteditable="true"></div>
            <button class="comment-btn" @click="sendReply(comment)">回复</button>
          </div>
          <div class="reply-container" v-for="reply in comment.reply_list" v-show="comment.reply_unfold">
            <img class="avatar" :src="getAvatarUrl(reply.sender_id)" alt="avatar" />
            <div class="nav-right">
              <div class="user-data">
                <div class="name">{{ reply.sender_id }}</div>
                <div class="time">{{ reply.reply_time }}</div>
              </div>
              <div class="text" v-html="reply.reply_content"></div>
              <div class="metrics">
                <div class="metric" @click="handleLikeReplyClicked(reply)">
                  <img class="icon" :src="getLikeIcon(reply.liked)" alt="icon" width="16" height="16" />
                  <div class="value">{{ reply.reply_like_count }}</div>
                </div>
                <!-- <div class="metric" @click="handleReplyClicked(comment.comment_id)">回复</div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="spacer"></div>
    </div>
  </div>
</template>
<style scoped>
.head {
  position: fixed;
  width: 598.4px;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid var(--dark-gray);
  height: 60px;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  align-items: center;
  z-index: 1;
}
.back-btn {
  cursor: pointer;
  margin: 10px;
}
.to-top-btn {
  margin-left: auto;
  margin-right: 13px;
  cursor: pointer;
}
.title {
  font-size: 20px;
}
.block {
  box-sizing: border-box;
  padding: 8px;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid var(--dark-gray);
  margin-top: 60px;
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
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 999px;
  align-self: flex-start;
}
.data {
  flex: 1;
}
.user-data {
  display: flex;
  flex-direction: row;
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
  cursor: pointer;
}

.icon {
  margin-right: 5px;
  cursor: pointer;
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
.comment-sender {
  display: flex;
  flex-direction: row;
  padding: 8px;
  border-bottom: 1px solid var(--dark-gray);
  align-items: center;
}
.comment-edior {
  width: 300px;
  border: 1px solid var(--dark-gray);
  border-radius: 6px;
  padding: 8px;
  font-size: 16px;
  box-sizing: border-box;
  resize: none;
  outline: none;
  margin: 5px 0;
}
.comment-block {
  display: flex;
  flex-direction: column;
}
.comment-btn {
  background-color: var(--dark);
  padding: 6px 14px;
  border: 1px solid var(--dark-gray);
  border-radius: 999px;
  cursor: pointer;
  margin-left: 10px;
  margin-bottom: 5px;
  align-self: flex-end;
}
.comment-container {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid var(--dark-gray);
  padding: 8px;
}
.spacer {
  height: 1000px;
}
.reply-sender {
  display: flex;
  flex-direction: row;
  padding: 8px;
  border-bottom: 1px solid var(--dark-gray);
  align-items: center;
}
.empty-indicator {
  font-size: 18px;
  color: var(--light-gray);
  text-align: center;
  margin-top: 50px;
}
.reply-container {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid var(--dark-gray);
  padding: 8px;
}
</style>

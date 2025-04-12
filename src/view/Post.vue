<script setup>
import client from '@/client/client'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import cookie from 'js-cookie'
const router = useRouter()
const editor = ref('')
const handlePost = async () => {
  console.log(editor.value.innerHTML)
  // TODO: upload to server
  const res = await client.post.post('/uploadPost', {
    author_id: cookie.get('user_id'),
    post_content: editor.value.innerHTML,
  })
  if (res.data === 'success') {
    editor.value.innerHTML = ''
    alert('上传成功')
  } else {
    alert('上传失败')
  }
}
const handleBack = () => {
  router.push('/push')
}
const handlePaste = event => {
  event.preventDefault()
  const text = event.clipboardData.getData('text/plain')
  // console.log(text)
  const selection = window.getSelection()
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    range.deleteContents()
    const lines = text.split('\r\n')
    console.log(lines)
    lines.forEach((line, index) => {
      range.insertNode(document.createTextNode(line))
      range.collapse(false)

      range.insertNode(document.createElement('br'))
      // console.log(line)
      range.collapse(false)
    })
    // range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}
onMounted(() => {
  document.getElementById('editor').focus()
})
</script>
<template>
  <div>
    <div class="head">
      <img class="back-btn" @click="handleBack" src="/arrow-left.svg" />
      <span class="title">发布</span>
    </div>
    <div id="editor" ref="editor" @paste="handlePaste" contenteditable="true"></div>
    <button id="post-btn" @click="handlePost">上传</button>
    <div class="spacer"></div>
  </div>
</template>
<style scoped>
#editor {
  min-height: 500px;
  border-bottom: 1px solid var(--dark-gray);
  padding: 18px;
  font-size: 18px;
  box-sizing: border-box;
  resize: none;
  outline: none;
  background-color: var(--dark);
}
#post-btn {
  background-color: var(--blue);
  margin: 10px 10px;
  border: none;
  border-radius: 999px;
  height: 50px;
  font-size: 20px;
  cursor: pointer;
}
.head {
  border-bottom: 1px solid var(--dark-gray);
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  height: 60px;
}
.back-btn {
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin: 10px;
}
.title {
  font-size: 20px;
}
.spacer {
  min-height: 100vh;
}
</style>

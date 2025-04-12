import router from '@/router'
import cookie from 'js-cookie'
import client from '/src/client/client'
const getAvatarUrl = userId => {
  return `http://localhost/user/getUserAvatar?user_id=${userId}`
}
const handleAvatarClicked = userId => {
  router.push({ name: 'Profile', params: { userId } })
}
const addFollow = async userId => {
  const res = await client.follow.post('/addFollow', {
    follower_id: cookie.get('user_id'),
    followee_id: userId,
  })
  if (res.data === 'success') {
    console.log('关注成功')

    return true
  } else {
    console.log('关注失败', res.data)
    return false
  }
}
const deleteFollow = async userId => {
  const res = await client.follow.post('/deleteFollow', {
    follower_id: cookie.get('user_id'),
    followee_id: userId,
  })
  if (res.data === 'success') {
    console.log('取消关注成功')
    return true
  } else {
    console.log('取消关注失败', res.data)

    return false
  }
}
export { getAvatarUrl, handleAvatarClicked, addFollow, deleteFollow }

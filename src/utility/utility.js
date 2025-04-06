import client from '@/client/client'
const getUser = async userId => {
  const res = await client.user.get('/getUserProfile', {
    params: {
      user_id: userId,
    },
  })
  return res.data
}
const getAvatarUrl = userId => {
  return `http://localhost:8081/getUserAvatar?user_id=${userId}`
}
export { getUser, getAvatarUrl }

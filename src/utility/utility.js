import client from '@/client/client'
const getAvatarUrl = userId => {
  return `http://localhost/user/getUserAvatar?user_id=${userId}`
}
export { getAvatarUrl }

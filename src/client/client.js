import axios from 'axios'

const login = axios.create({
  baseURL: 'http://localhost:80/login',
  headers: {},
})
const user = axios.create({
  baseURL: 'http://localhost:80/user',
  headers: {},
})
const post = axios.create({
  baseURL: 'http://localhost:80/post',
  headers: {},
})
const interaction = axios.create({
  baseURL: 'http://localhost:80/interaction',
  headers: {},
})
const comment = axios.create({
  baseURL: 'http://localhost:80/comment',
  headers: {},
})
const search = axios.create({
  baseURL: 'http://localhost:80/search',
  headers: {},
})
const follow = axios.create({
  baseURL: 'http://localhost:80/follow',
  headers: {},
})
const client = {
  login,
  user,
  post,
  interaction,
  comment,
  search,
  follow,
}
export default client

import axios from 'axios'
const login = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {},
})
const user = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {},
})
const post = axios.create({
  baseURL: 'http://localhost:8082',
  headers: {},
})
const interaction = axios.create({
  baseURL: 'http://localhost:8083',
  headers: {},
})
const comment = axios.create({
  baseURL: 'http://localhost:8084',
  headers: {},
})
const client = {
  login,
  user,
  post,
  interaction,
  comment,
}
export default client

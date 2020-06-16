import axios from 'axios'

export function request(config) {
  // 1. 创建 axios 实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:8000/api/n3',
    timeout: 50000
  })

  // axios 的拦截器
  instance.interceptors.request.use(config => {
    return config
  }, error => {
    // console.log(error)
  });
  instance.interceptors.response.use(res => {
    return res.data
  }, error => {
    // 响应失败
    // console.log(error)
  });

  return instance(config)
}

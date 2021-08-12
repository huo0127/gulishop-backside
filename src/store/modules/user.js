import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(), // 用戶登入成功的token
    name: '', // 獲取用戶訊息保存用戶訊息的名稱
    avatar: '' // 獲取用戶訊息保存用戶訊息的頭像
  }
}

const state = getDefaultState()

// const state = {
//   token: getToken(),
//   userInfo: ''
// }

const mutations = {
  RESET_STATE: state => {
    // Object.assign 合併後面的對象的屬性，到前面的對象當中
    Object.assign(state, getDefaultState())
    // state 原本的狀態
    // {
    //   token: getToken(), // 用戶登入成功的token
    //   name: 'admin', // 獲取用戶訊息保存用戶訊息的名稱
    //   avatar: 'xxx' // 獲取用戶訊息保存用戶訊息的頭像
    // }

    // getDefaultState() 調用並覆蓋
    // {
    //   token: getToken(), // 用戶登入成功的token
    //   name: '', // 獲取用戶訊息保存用戶訊息的名稱
    //   avatar: '' // 獲取用戶訊息保存用戶訊息的頭像
    // }

    // state 覆蓋變成
    // {
    //   token: getToken(), // 用戶登入成功的token
    //   name: '', // 獲取用戶訊息保存用戶訊息的名稱
    //   avatar: '' // 獲取用戶訊息保存用戶訊息的頭像
    // }

    // 以上代碼跟下面一樣，退出登入後把state當中的token及用戶訊息清空
    // state.token = ''
    // state.name = ''
    // state.avatar = ''
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  // 我們之前寫的是async和await，但他用 .then .catch
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token) // 之前我們是把獲取到的token保存在localStorage裡。他是cookies。
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response

          if (!data) {
            return reject('Verification failed, please Login again.')
          }

          const { name, avatar } = data

          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        })
        .catch(error => {
          reject(error.message)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // 把cookies內部的token刪除掉
          resetRouter() // 登出並重製路由器
          commit('RESET_STATE')
          resolve()
        })
        .catch(error => {
          reject(error.message)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

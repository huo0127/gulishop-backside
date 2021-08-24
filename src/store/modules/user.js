import { login, logout, getInfo } from '@/api/acl/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { allAsyncRoutes, resetRouter, anyRoute, constantRoutes } from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'

const getDefaultState = () => {
  return {
    token: getToken(), // 用戶登入成功的token
    name: '', // 獲取用戶訊息保存用戶訊息的名稱
    avatar: '', // 獲取用戶訊息保存用戶訊息的頭像

    // 權限相關的數據
    buttons: [], // 和按鈕相關的權限數據
    roles: [], // 和用戶角色相關的權限數據

    routes: [], // 和用戶相關的所有路由配置，這個數組是後期用戶形成的最終路由數組，不是字符串數據
    asyncRoutes: [] // 和用戶相關的所有異步路由數組，這個數組裡面也是路由對象，不是字符串數據

  }
}

// 這個函數專門根據用戶返回的routes路由name字符串數組過濾出用戶真正的異步路由數組
function filerMyAsyncRoutes(allAsyncRoutes, routeNames) {
  const myAsyncRoutes = allAsyncRoutes.filter(item => {
    // 判斷一級路由
    if (routeNames.indexOf(item.name) !== -1) {
      // 判斷二級路由，用遞歸操作
      if (item.children && item.children.length) {
        // 遞歸查找符合條件的二級路由，然後把二級路由整體改為符合條件的二級路由
        item.children = filerMyAsyncRoutes(item.children, routeNames)
      }
      return true
    }
  })
  return myAsyncRoutes
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
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  SET_USERINFO(state, userInfo) {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },

  SET_ROUTES(state, myAsyncRoutes) {
    state.asyncRoutes = myAsyncRoutes // 把過濾出來自己的異步路由保存起來
    // 使用常量路由拼接自己的異步路由和任意路由，形成自己的最終的所有路由數組
    state.routes = constantRoutes.concat(myAsyncRoutes, anyRoute)

    // 現在目前的路由當中只有常量路由，目前我們需要將路由器中配的路由動態的改變成我們最終的路由
    // 動態往路由器註冊添加新的路由
    // 目前我們的路由配置當中已經有常量路由，我們需要把用戶自己的異步路由和任意路由給動態添加
    router.addRoutes([...myAsyncRoutes, anyRoute]) // 動態的把自己的異步路由和任意路由註冊到路由器內部數組
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

          // const { name, avatar } = data
          // commit('SET_NAME', name)
          // commit('SET_AVATAR', avatar)

          commit('SET_USERINFO', data)

          // 還要去根據用戶訊息返回來的routes(和路由name相關的字符串數組)，從所有的異步路由數組當中過濾出用戶自己的所有路由數組
          // data.routes 他是字符串數組，字符串都是路由的name值組成的 ['Trademark','Attr']

          // cloneDeep(allAsyncRoutes) 我們最終要改為這樣
          // 因為過濾的時候如果是在數據本身上去過濾，那麼過濾完成之後，數據的二級路由就改變了
          // 數據本身之前的二級路由會被過濾後的二級路由覆蓋，想找到就沒辦法了
          // 表現在，先登錄其他的只有某個二級路由的用戶，然後退出登陸admin，那麼admin也只有那一個二級路由
          commit('SET_ROUTES', filerMyAsyncRoutes(cloneDeep(allAsyncRoutes), data.routes))

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

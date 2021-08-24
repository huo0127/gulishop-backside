import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

// 常量路由，不需要權限數據，就可以使用路由，對應的菜單就可以操作，所有用戶都可以操作
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 首頁
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard', // 後面我們配的所有路由，都要配個name值，是大寫字母開頭。
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首頁 ', icon: 'dashboard' }
      }
    ]
  }
]

// 儲存的是需要權限數據控制的所有路由，後期需要從這些裡面根據路由權限數據過濾出需要的路由進行動態配置
export const allAsyncRoutes = [
  // 权限数据管理相关的路由
  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock'
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        component: () => import('@/views/acl/user/list'),
        meta: {
          title: '用户管理'
        }
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: {
          title: '角色管理'
        }
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权'
        },
        hidden: true
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: {
          title: '菜单管理'
        }
      }
    ]
  },

  // 配置商品管理相關的路由
  {
    path: '/product', // 一級路由組件只有兩個 login組件、layout組件
    component: Layout, // 顯示一級路由組件架子，並立即重定向二級路由組件
    name: 'Product', // name必須寫，而且必須寫的是路徑首字母大寫，因為後面權限要用。
    meta: { title: '商品管理', icon: 'el-icon-s-shop' },
    redirect: '/product/trademark/list',
    children: [
      {
        path: 'trademark/list',
        component: () => import('@/views/product/trademark/List'),
        name: 'Trademark',
        meta: { title: '品牌管理' }
      },
      {
        path: 'attr/list',
        component: () => import('@/views/product/attr/List'),
        name: 'Attr',
        meta: { title: '平台管理' }
      },
      {
        path: 'spu/list',
        component: () => import('@/views/product/spu/List'),
        name: 'Spu',
        meta: { title: 'SPU管理' }
      },
      {
        path: 'sku/list',
        component: () => import('@/views/product/sku/List'),
        name: 'Sku',
        meta: { title: 'SKU管理' }
      },
      {
        path: 'category/list',
        component: () => import('@/views/product/category/List'),
        name: 'Category',
        meta: { title: '分類管理' }
      },
      {
        path: 'scoped/list',
        component: () => import('@/views/product/scoped/List'),
        name: 'Scoped',
        meta: { title: 'Scoped測試' }
      }
    ]
  },

  // 自己添加的測試菜單
  {
    path: '/test', // 一級路由組件只有兩個 login組件、layout組件
    component: Layout, // 顯示一級路由組件架子，並立即重定向二級路由組件
    name: 'Test', // name必須寫，而且必須寫的是路徑首字母大寫，因為後面權限要用。
    meta: { title: '測試管理', icon: 'el-icon-s-tools' },
    redirect: '/test/test111/list',
    children: [
      {
        path: 'test111/list',
        component: () => import('@/views/test/test111/List'),
        name: 'Test111',
        meta: { title: '測試111' }
      },
      {
        path: 'test222/list',
        component: () => import('@/views/test/test222/List'),
        name: 'Test222',
        meta: { title: '測試222' }
      }

    ]
  }

]

// 任意路由，當用戶隨意的樹入一個路徑，那麼應該顯示404，任意路由必須是註冊在最後一個
export const anyRoute = { path: '*', redirect: '/404', hidden: true }

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    // 一開始沒做權限的時候，這裡面只有常量路由，要做權限操作，後面是需要動態的往這個路由配置數組當中添加用戶自己的異步路由和任意路由
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

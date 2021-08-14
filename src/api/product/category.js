// 這個文件裡面是和三級聯動的接口請求函數
import request from '@/utils/request'

export default {
  // 獲取一級分類列表
  // GET /admin/product/getCategory1
  getCategory1() {
    return request.get('/admin/product/getCategory1')
  },

  // 根據一級分類id獲取2級分類列表
  // GET /admin/product/getCategory2/{category1Id}
  getCategory2(category1Id) {
    return request.get(`/admin/product/getCategory2/${category1Id}`)
  },

  // 根據二級分類id獲取3級分類列表
  // GET /admin/product/getCategory3/{category2Id}
  getCategory3(category2Id) {
    return request.get(`/admin/product/getCategory3/${category2Id}`)
  }
}

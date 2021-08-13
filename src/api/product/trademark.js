// 這個文件裡面是和品牌相關的接口請求函數
import request from '@/utils/request'

export default {
  // 每個接口請求函數

  //   DELETE /admin/product/baseTrademark/remove/{id}
  //   根據品牌删除某個品牌
  delete(id) {
    /*
    axios的對象寫法，
    第一個參數永遠是路徑
    第二個參數要看請求方式
        如果是post和put請求，第二個參數是請求體參數(一個對象)
        如果是其他的請求，第二個參數是一個配置對象(一般不寫)
     */
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },

  /*
    POST /admin/product/baseTrademark/save
    新增一個品牌
    PUT /admin/product/baseTrademark/update
    修改一個品牌
    無論是增還是改，都需要一個請求體參數，這個參數是品牌對象
    但是這兩種請求方式，所傳遞的對象是不一樣的，如果是新增品牌對象裡面沒有
    id，如果是修改，品牌對象裡面有id
  */
  addOrUpdate(trademark) {
    if (trademark.id) {
      // 如果id存在證明是在修改
      return request.put(`/admin/product/baseTrademark/update`, trademark)
    } else {
      // id不存在證明在添加
      return request.post('/admin/product/baseTrademark/save', trademark)
    }
  },

  //   GET /admin/product/baseTrademark/{page}/{limit}
  //   查詢品牌的分頁列表數據
  getPageList(page, limit) {
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  }
}

// 最終往外暴露的是
// {
//     default:{}
// }

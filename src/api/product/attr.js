// 這個文件裡面是和attr的接口請求函數
import request from '@/utils/request'

export default {
  // 屬性的增刪改查

  // 根據選中的123級分類id獲取或性列表
  // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  getList(category1Id, category2Id, category3Id) {
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },

  // 根據屬性id刪除某個屬性
  // DELETE /admin/product/deleteAttr/{attrId}
  delete(attrId) {
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
  },

  // 增加或者修改屬性
  // POST /admin/product/saveAttrInfo

  addOrUpdate(attr) {
    return request.post('/admin/product/saveAttrInfo', attr)
  }
}

// {
//   tmName,
//   logoUrl
// }

// attr = {
//   "attrName": "string",
//   "attrValueList": [
//     {
//       "attrId": 0,
//       "id": 0,
//       "valueName": "string"
//     }
//   ],
//   "categoryId": 0,
//   "categoryLevel": 0,
//   "id": 0
// }

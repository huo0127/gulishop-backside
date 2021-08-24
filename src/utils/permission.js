// 這個函數是用來檢測用戶是否有某種按鈕的權限

import store from '@/store'

export function hasBtnPermission(btnName) {
  let buttons = store.getters.buttons // 獲取到用戶返回的所有按鈕級別權限數據的字符串數組
  return buttons.indexOf(btnName) !== -1
}

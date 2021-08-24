// 這個文件目的是把所有的接口整合到一起，然後一起去暴露
// 引入  暴露(對象)  之前學的
// 引入並暴露
// 可以理解為先引入，引入之後在暴露出去
// import trademark from './trademark'
// import attr from './attr'

// 使用引入並暴露的方式，default引入的時候不能簡寫
export { default as trademark } from './product/trademark'
export { default as attr } from './product/attr'
export { default as category } from './product/category'
export { default as sku } from './product/sku'
export { default as spu } from './product/spu'
export { default as permission } from './acl/permission'
export { default as role } from './acl/role'
export * as user from './acl/user'

// 相當於分別暴露了 trademark和attr 對象

// 最終出去的是
// {
//   trademark,
//   attr
// }

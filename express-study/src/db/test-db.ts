/**
 * 增
*/
// import insert from './user/insert'
// insert([
//   {
//     username: 'fanzhiliang777',
//     phone: 13128269777,
//     hobby: ['混吃等死'],
//   },
// ]).then(res => {
//   console.log(res)
// }).catch(err => {
//   console.log(err)
// })

/**
 * 删
*/
// import deleteMany from './user/delete'
// deleteMany({
//   username: 'fanzhiliang777',
// }).then(res => {
//   console.log(res)
// }).catch(err => {
//   console.log(err)
// })

/**
 * 改
*/
// import update from './user/update'
// update({
//   username: 'alcyh',
// }, {
//   phone: 13128269555,
// }).then(res => {
//   console.log(res)
// }).catch(err => {
//   console.log(err)
// })

/**
 * 查
*/
import { find } from './user/find'
find({
  username: 'fanzhiliang',
}, {
  _id: 0,
  hobby: 0,
}, {

}).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})

import { list } from './user/find'
list({
  username: 'fan',
  phone: '131',
}, {
  current: 1,
  size: 20,
}).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})

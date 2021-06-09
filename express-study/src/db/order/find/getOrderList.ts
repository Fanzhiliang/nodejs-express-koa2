import { Order, OrderModel } from '../index'
import { ListParams, ListResult, createQueryOptions } from '../../common-model/list'

/**
 * 获取订单列表
*/

export const getOrderList = async function(
  this: typeof Order,
  userId: string,
  params: ListParams,
): Promise<ListResult<OrderModel>> {
  const query = createQueryOptions(params, Order.schema)
  return Promise.all([
    this.aggregate([
      { $match: { userId }},
      {
        $lookup: {
          from: 'user',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'child-order',
          localField: 'childOrderIds',
          foreignField: '_id',
          as: 'orderList',
        },
      },
      {
        $lookup: {
          from: 'goods',
          localField: 'orderList.goodsId',
          foreignField: '_id',
          as: 'goodsList',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $addFields: {
          username: '$user.username',
          phone: '$user.phone',
        },
      },
      {
        $project: {
          childOrderIds: 0,
          user: 0,
        },
      },
    ])
      .skip(query.skip as number)
      .limit(query.limit as number)
      .sort(query.sort),
    this.count(),
  ]).then(([_list, total]) => {
    const list = _list as OrderModel[]
    // 设置商品列表的商品数量
    list.forEach(item => {
      item.goodsList?.forEach(it => {
        const findObj = item.orderList?.find(i => i.goodsId?.toString() === it._id?.toString())
        if (findObj) {
          it.number = findObj.number
        }
      })
      delete item.orderList
    })
    return Promise.resolve({
      list,
      total,
    })
  })
}

import { Order, OrderModel } from '../index'
import { ListParams, ListResult, createQueryOptions } from '../../model/list'

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
  ]).then(([list, total]) => {
    return Promise.resolve({
      list: list as OrderModel[],
      total,
    })
  })
}

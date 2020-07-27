// Get order array working with categories
module.exports = function order_sort_category (order, categories) {
  let tmp_order = []
  for (const index in order) {
    const item = order[index]
    if (categories[item]) tmp_order.push(item)
  }
  return tmp_order
}
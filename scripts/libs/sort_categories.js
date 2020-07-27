// Function sort category order.
module.exports = function sort_categories (categories) {
  const tmp_categories = {},
        order          = ['Improvements', 'Fixes', 'Node.JS', 'GitHub'],
        tmp_order      = order_sort_category(order, categories)

  while (Object.keys(tmp_categories).length !== Object.keys(categories).length) {
    for (const value in categories) {
      if (tmp_order[0] === value) {
        tmp_categories[value] = categories[value]
        tmp_order.shift()
      }
    }
  }

  return tmp_categories
  
}
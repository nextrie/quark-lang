// Function return category markdown content.
module.exports = function display_category (category_name, category_items) {

  let category_content = ''

  category_content += `### ${category_name}:\n`
  
  for (const item of category_items) {
    category_content += `- ${item}\n`
  }

  return category_content

}
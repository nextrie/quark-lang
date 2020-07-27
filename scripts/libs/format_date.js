// Function format date.
module.exports = function format_date (date) {
  date = date
    .match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)[0].split('T')
  let f_date = date,
    time = f_date[1]
      .split(/:/g)
      .map((x, index) => index === 0 ? x = parseInt(x) + 2 : x)
      .join(':'),
    final_date = [f_date[0], 'T', time]
      .join('')

  return final_date
}
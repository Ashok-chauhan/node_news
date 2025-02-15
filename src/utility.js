var count = 0;
async function getData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const unfilterCategory = data.response.categories;
  // console.log(data.response.categories);
  const filterdCategory = unfilterCategory.filter((category) => {
    //console.log(category.parser_type);
    if (category.parser_type == "whiz_rss_stories") {
      // console.log(category);
      return category;
    }
  });
  count += 1;
  //console.log('COUNT ----> ', count);

  return filterdCategory;
}

async function getCategory(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

module.exports = {
  getData,
  getCategory,
};

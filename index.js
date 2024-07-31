const { checkArticleSorting } = require('./utils/checkArticleSorting');

(async () => {
  const url = "https://news.ycombinator.com/newest";
  const articleCount = 100; // Number of articles to check
  const ascending = false; // Descending order
  
  const isValidArticleList = await checkArticleSorting(url, articleCount, ascending);

  if (isValidArticleList) {
    console.log(`The first ${articleCount} articles are sorted correctly and there are ${articleCount} articles.`);
  } else {
    console.log(`The articles are not sorted correctly, or there are fewer than ${articleCount} articles, or both.`);
  }
})();

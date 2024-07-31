const fs = require('fs');
const path = require('path');

/**
 * Generates HTML for articles with given timestamps.
 *
 * @param {number} numOfArticles - The number of articles to generate.
 * @param {boolean} isValidOrder - Determines if the articles should be in a valid chronological order. True for valid, false for random order.
 * @returns {string} - The generated HTML for the articles.
 */
const generateArticlesHTML = (numOfArticles, isValidOrder = true) => {
  let articlesHTML = '';
  const now = new Date();
  
  for (let i = 1; i <= numOfArticles; i++) {
    const timestamp = new Date(now.getTime() - (i * 1000 * 60 * 60)).toISOString();
    const timeAgo = formatTimeAgo(i);
    
    // For invalid order, generate a random timestamp
    const displayTimestamp = isValidOrder ? timestamp : generateRandomTimestamp(now);
    const displayTimeAgo = isValidOrder ? timeAgo : formatTimeAgo(Math.floor(Math.random() * 24 * 7) + 1);

    articlesHTML += generateArticleRow(i, displayTimestamp, displayTimeAgo);
  }

  return articlesHTML;
};

/**
 * Formats the "time ago" text for an article.
 *
 * @param {number} hoursAgo - The number of hours ago the article was posted.
 * @returns {string} - A string representing how long ago the article was posted.
 */
const formatTimeAgo = (hoursAgo) => {
  return hoursAgo < 60 ? `${hoursAgo} minutes ago` : `${Math.floor(hoursAgo / 60)} hours ago`;
};

/**
 * Generates a random timestamp within the past week.
 *
 * @param {Date} now - The current date and time.
 * @returns {string} - A random timestamp in ISO format.
 */
const generateRandomTimestamp = (now) => {
  // Range from 1 to 168 (the number of hours in a week)
  const randomHours = Math.floor(Math.random() * 24 * 7) + 1; 
  return new Date(now.getTime() - (randomHours * 1000 * 60 * 60)).toISOString();
};

/**
 * Generates a single article row in HTML format.
 *
 * @param {number} index - The index of the article.
 * @param {string} timestamp - The timestamp of the article.
 * @param {string} timeAgo - The "time ago" string for the article.
 * @returns {string} - The HTML string representing an article row.
 */
const generateArticleRow = (index, timestamp, timeAgo) => `
  <tr class="athing" id="article-${index}">
    <td align="right" valign="top" class="title"><span class="rank">${index}.</span></td>
    <td valign="top" class="votelinks">
      <center>
        <a id="up_article-${index}" href="vote?id=article-${index}&amp;how=up&amp;goto=newest">
          <div class="votearrow" title="upvote"></div>
        </a>
      </center>
    </td>
    <td class="title">
      <span class="titleline">
        <a href="https://example.com/article-${index}" rel="nofollow">Article ${index}</a>
      </span>
    </td>
  </tr>
  <tr>
    <td colspan="2"></td>
    <td class="subtext">
      <span class="subline">
        <span class="score" id="score_article-${index}">1 point</span>
        by <a href="user?id=user-${index}" class="hnuser">user-${index}</a>
        <span class="age" title="${timestamp}">
          <a href="item?id=article-${index}">${timeAgo}</a>
        </span>
        | <a href="hide?id=article-${index}&amp;goto=newest">hide</a>
        | <a href="https://hn.algolia.com/?query=Article%20${index}&amp;type=story&amp;dateRange=all&amp;sort=byDate&amp;storyText=false&amp;prefix&amp;page=0" class="hnpast">past</a>
        | <a href="item?id=article-${index}">discuss</a>
      </span>
    </td>
  </tr>
  <tr class="spacer" style="height:5px"></tr>
`;

/**
 * Generates the full HTML content including the body with articles.
 *
 * @param {string} bodyContent - The HTML content for the body section.
 * @returns {string} - The complete HTML page as a string.
 */
const generateHTMLContent = (bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mock Articles</title>
  <style>
    /* Basic styles to mimic Hacker News layout */
    body { font-family: Arial, sans-serif; }
    .titleline a { color: #000; text-decoration: none; }
    .subtext a { color: #828282; text-decoration: none; }
    .rank { color: #999; }
    .spacer { background: #f6f6ef; }
  </style>
</head>
<body>
  <table>
    <tbody>
      ${bodyContent}
    </tbody>
  </table>
</body>
</html>
`;

const testsDir = path.join(__dirname, '../tests/mock-html');
const htmlFilePathValid = path.join(testsDir, 'mock-100-articles-valid.html');
const htmlFilePathInvalidAmount = path.join(testsDir, 'mock-99-articles-invalid-amount.html');
const htmlFilePathInvalidOrder = path.join(testsDir, 'mock-100-articles-invalid-order.html');

try {
  const articlesHTMLValid = generateArticlesHTML(100, true);
  const articlesHTMLInvalidAmount = generateArticlesHTML(99, true);
  const articlesHTMLInvalidOrder = generateArticlesHTML(100, false);

  fs.writeFileSync(htmlFilePathValid, generateHTMLContent(articlesHTMLValid));
  console.log(`Mock HTML for 100 articles generated in ${htmlFilePathValid}`);

  fs.writeFileSync(htmlFilePathInvalidAmount, generateHTMLContent(articlesHTMLInvalidAmount));
  console.log(`Mock HTML for 99 articles generated in ${htmlFilePathInvalidAmount}`);

  fs.writeFileSync(htmlFilePathInvalidOrder, generateHTMLContent(articlesHTMLInvalidOrder));
  console.log(`Mock HTML for 100 articles with random order generated in ${htmlFilePathInvalidOrder}`);
} catch (error) {
  console.error(`Error generating mock HTML files: ${error.message}`);
}

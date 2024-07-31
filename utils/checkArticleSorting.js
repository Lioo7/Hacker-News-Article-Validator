const { chromium } = require('playwright');

/**
 * Checks if articles on the given URL are sorted by date. 
 * Returns false if the number of articles is less than the specified count or if the sorting order is incorrect.
 *
 * @param {string} url - The URL to navigate to.
 * @param {number} articleCount - The number of articles to check.
 * @param {boolean} ascending - True for ascending order, false for descending order.
 * @returns {boolean} - True if articles are sorted as specified and the number of articles is sufficient, false otherwise.
 */
async function checkArticleSorting(url, articleCount = 100, ascending = false) {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`Navigating to URL: ${url}`);
    await page.goto(url);
  
    let timestamps = [];
    while (timestamps.length < articleCount) {
      console.log(`Collecting timestamps... Current count: ${timestamps.length}`);
      
      // Extract timestamps from the 'title' attribute of the <span> elements
      const newTimestamps = await page.$$eval('span.age', elements => 
        elements.map(el => el.getAttribute('title'))
      );

      console.log(`Found ${newTimestamps.length} new timestamps on this page.`);
      timestamps = timestamps.concat(newTimestamps);

      if (timestamps.length >= articleCount) break;

      // Check if the "More" link exists and load the next page if it does
      const moreLinkExists = await page.$('a.morelink');
      if (moreLinkExists) {
        console.log("Clicking 'More' link to load next page...");
        await Promise.all([
          page.waitForNavigation(),
          page.click('a.morelink')
        ]);
      } else {
        console.log("No more pages available.");
        break;
      }
    }

    if (timestamps.length < articleCount) {
      console.log(`Less than ${articleCount} articles were found!\n${timestamps.length} timestamps in total.`);
      return false;
    }

    console.log(`Collected ${timestamps.length} timestamps in total.`);
    timestamps = timestamps.slice(0, articleCount);
  
    console.log("Converting timestamps to Date objects...");
    const dateObjects = timestamps.map(timestamp => new Date(timestamp)).filter(date => !isNaN(date));

    if (dateObjects.length < articleCount) {
      console.error("Some timestamps could not be converted to valid Date objects.");
      return false;
    }

    console.log("Checking if articles are sorted...");
    const isSorted = dateObjects.every((date, i) => 
      i === 0 || (ascending ? date >= dateObjects[i - 1] : date <= dateObjects[i - 1])
    );

    console.log(isSorted ? "The articles are sorted correctly." : "The articles are not sorted correctly.");
    return isSorted;
  } catch (error) {
    console.error(`Error occurred: ${error.message}`);
    return false;
  } finally {
    await browser.close();
  }
}

module.exports = { checkArticleSorting };

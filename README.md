# Hacker News Article Validator
[![Node.js](https://img.shields.io/badge/node.js-14.x-green)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/playwright-1.39.0-blue)](https://playwright.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

This project is a script developed to validate the order and count of articles on the Hacker News website, specifically on the "newest" page. The script ensures that a specified number of articles (default 100) are sorted from newest to oldest.

## Project Structure
- **index.js**: The main script that orchestrates the validation process.
- **utils/checkArticleSorting.js**: Contains the function to navigate the website, collect article timestamps, and validate their sorting and count.
- **generate-html.js**: A script to generate mock HTML files for testing purposes.
- **tests/checkArticleSorting.test.js**: Playwright test suite for the `checkArticleSorting` function, covering various scenarios including article sorting, count, and edge cases.
- **tests/mock-html**: Directory containing mock HTML files used for testing.

## Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Lioo7/Hacker-News-Article-Validator.git
   cd hacker_news_article_validator
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```

## Usage
### Running the Main Script
To validate the sorting of articles on Hacker News:
```bash
node index.js
```

The main script (`index.js`) uses the following configuration:
- URL: https://news.ycombinator.com/newest
- Article Count: 100
- Sorting Order: Descending (newest to oldest)

You can modify these parameters in the `index.js` file if needed.

### Running Tests
The tests include validation using mock data and are run automatically with a local server setup:
```bash
npx playwright test
```

## How It Works
1. **Test-Driven Development**: The project follows a TDD approach. The test cases in `checkArticleSorting.test.js` validate the functionality of the sorting check logic against both real and mock data.

2. **Script Execution**: The `index.js` file initiates the script that navigates to Hacker News, collects article timestamps, and verifies their order and count using the `checkArticleSorting` function.

3. **Article Sorting Check**: The `checkArticleSorting` function in `utils/checkArticleSorting.js` is the core of the validation process. It takes the following parameters:
   - `url` (string): The URL to navigate to (e.g., "https://news.ycombinator.com/newest")
   - `articleCount` (number, default: 100): The number of articles to check
   - `ascending` (boolean, default: false): True for ascending order, false for descending order

   The function returns `true` if the articles are sorted correctly and the number of articles is sufficient, `false` otherwise.

4. **Mock Data**: The `generate-html.js` script is used to create mock HTML data for testing, ensuring robustness against different scenarios.

## Function Details
The `checkArticleSorting` function performs the following steps:
1. Launches a headless browser using Playwright
2. Navigates to the specified URL
3. Collects timestamps from article elements
4. If necessary, clicks the "More" link to load additional pages
5. Verifies the number of articles collected
6. Checks if the articles are sorted in the specified order
7. Returns the result of the validation

## Notes
- The project uses Playwright for browser automation and testing.
- Make sure to have a stable internet connection when running tests or scripts that access live websites.
- The script is designed to handle pagination by clicking the "More" link if the initial page doesn't contain enough articles.
- Error handling is implemented to catch and log any issues during the validation process.

## Customization
To modify the validation parameters, edit the `index.js` file. You can change the URL, article count, or sorting order as needed.

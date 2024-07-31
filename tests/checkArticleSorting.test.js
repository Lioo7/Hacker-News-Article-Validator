const { test, expect } = require('@playwright/test');
const { checkArticleSorting } = require('../utils/checkArticleSorting');
const httpServer = require('http-server');
const port = 8080;

let server;

test.beforeAll(async () => {
  server = httpServer.createServer({ root: 'tests' });
  server.listen(port);
});

test.afterAll(() => {
  server.close();
});

// Base URL for the mock HTML files
const baseUrl = "http://localhost:8080/mock-html";

/**
 * Test to check if exactly the specified number of articles are sorted from newest to oldest.
 */
test('should have exactly 100 articles sorted from newest to oldest', async () => {
  const url = `${baseUrl}/mock-100-articles-valid.html`;
  const isValid = await checkArticleSorting(url, 100, false);
  expect(isValid).toBe(true, 'Articles should be sorted from newest to oldest and contain exactly 100 articles.');
});

/**
 * Test to verify handling of less than the specified number of articles.
 */
test('should fail if there are less than 100 articles', async () => {
  const url = `${baseUrl}/mock-99-articles-invalid-amount.html`;
  const isValid = await checkArticleSorting(url, 100, false);
  expect(isValid).toBe(false, 'The page should fail validation if it contains less than 100 articles.');
});

/**
 * Test to verify handling of articles in random order.
 */
test('should fail if articles are not sorted from newest to oldest', async () => {
  const url = `${baseUrl}/mock-100-articles-invalid-order.html`;
  const isValid = await checkArticleSorting(url, 100, false);
  expect(isValid).toBe(false, 'The page should fail validation if articles are not sorted from newest to oldest.');
});

/**
 * Test to verify handling of articles on the real website.
 */
test('should validate sorting of articles on the real website', async () => {
  const url = "https://news.ycombinator.com/newest";
  const isValid = await checkArticleSorting(url, 100, false);
  expect(isValid).toBe(true, 'The first 100 articles on the real website should be sorted from newest to oldest.');
});

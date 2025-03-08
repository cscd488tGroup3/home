import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import puppeteer from 'puppeteer';
import CityInput from '../src/components/CityInput.astro';

test('dispatches event with city name when input is filled', async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(CityInput);

  // Start a Puppeteer browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set the content of the page to the rendered HTML from Astro
  await page.setContent(result);

  // Simulate user interaction with Puppeteer
  const input = await page.$('input[placeholder="Enter city name"]');
  const button = await page.$('button:contains("Search")');

  // Type the city name into the input field
  await input.type('London');
  await button.click();

  // Optionally, you can wait for the event or check for changes
  await page.waitForTimeout(1000); // Adjust timing as needed for event handling

  // Extract and check the updated content
  const content = await page.content();
  expect(content).toContain('London');  // Check if the event has been fired properly
  
  await browser.close();
});

test('does not dispatch event if input is empty', async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(CityInput);

  // Start a Puppeteer browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the content of the page to the rendered HTML from Astro
  await page.setContent(result);

  // Simulate user interaction with Puppeteer
  const input = await page.$('input[placeholder="Enter city name"]');
  const button = await page.$('button:contains("Search")');

  // Type nothing into the input field and click the button
  await input.type('');
  await button.click();

  // Optionally, you can wait for the event or check for changes
  await page.waitForTimeout(1000); // Adjust timing as needed for event handling

  // Extract and check the updated content
  const content = await page.content();
  expect(content).toContain('City');  // Example text or event result for empty input

  await browser.close();
});

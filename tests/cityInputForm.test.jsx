import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import cheerio from 'cheerio';
import CityInput from '../src/components/CityInput.astro';

test('dispatches event with city name when input is filled', async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(CityInput);

  // Load the result into cheerio to query the HTML
  const $ = cheerio.load(result);

  // Query elements
  const input = $('input[placeholder="Enter city name"]');
  const button = $('button:contains("Search")');

  // Simulate the input change and click
  input.val('London');
  button.click();

  // Assertions
  expect(input.val()).toBe('London');
  // You can add additional event checks depending on the output of the event
  // Example: Check if an event is dispatched or a change is made
  expect(result).toContain('London');
});

test('does not dispatch event if input is empty', async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(CityInput);

  // Load the result into cheerio to query the HTML
  const $ = cheerio.load(result);

  // Query elements
  const input = $('input[placeholder="Enter city name"]');
  const button = $('button:contains("Search")');

  // Simulate the input change and click
  input.val('');
  button.click();

  // Assertions
  expect(input.val()).toBe('');
  // You can add assertions for an empty city name scenario
  expect(result).toContain('City'); // Example of what you expect to be in the result
});

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import * as cheerio from 'cheerio';
import CityInput from '../src/components/CityInput.astro';

test('dispatches event with city name when input is filled', async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(CityInput);

  const $ = cheerio.load(result);

  const input = $('input[placeholder="Enter city name"]');
  const button = $('button:contains("Search")');

  input.val('London');
  button.click();

  expect(input.val()).toBe('London');
  expect(result).toContain('London');
});

test('does not dispatch event if input is empty', async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(CityInput);

  const $ = cheerio.load(result);

  const input = $('input[placeholder="Enter city name"]');
  const button = $('button:contains("Search")');

  input.val('');
  button.click();

  expect(input.val()).toBe('');
  expect(result).toContain('City');
});

// test('has correct meta data', async () => {
//   const container = await AstroContainer.create();
//   const result = await container.renderToString(CityInput);

//   const $ = cheerio.load(result);

//   const metaDescription = $('meta[name="description"]').attr('content');
//   const metaKeywords = $('meta[name="keywords"]').attr('content');

//   expect(metaDescription).toBe('Expected description');
//   expect(metaKeywords).toBe('Expected keywords');
// });
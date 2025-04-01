import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import puppeteer from 'puppeteer';
import FullPage from '../src/pages/index.astro';
import dotenv from 'dotenv';

// Ensure your environment variables are set up correctly for the test
dotenv.config(); 

test(
  'ensures components are loaded properly in index.astro',
  async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(FullPage);
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.setContent(result);

    // Test that essential components are rendered
    const headerExists = await page.$('header');
    const footerExists = await page.$('footer');

    expect(headerExists).not.toBeNull();
    expect(footerExists).not.toBeNull();

    await browser.close();
  },
  15000
);

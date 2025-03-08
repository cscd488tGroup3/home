import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import CityInput from '../src/components/CityInput.astro'; // Make sure it's an Astro component

test('dispatches event with city name when input is filled', async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(CityInput);

  const { getByPlaceholderText, getByText } = container;
  const input = getByPlaceholderText('Enter city name');
  const button = getByText('Search');

  input.value = 'London';
  button.click();

  // Add your event assertions here

  expect(result).toContain('London');
  
});

test('does not dispatch event if input is empty', async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(CityInput);

  const input = getByPlaceholderText('Enter city name');
  const button = getByText('Search');

  input.value = '';
  button.click();

  // Add your event assertions here

  expect(result).toContain('City');
  
});


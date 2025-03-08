import { render, fireEvent, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';
import CityInputForm from '../src/components/CityInputForm.astro'; // Adjust the import path as needed

describe('City Input Form', () => {
  it('dispatches citySearch event with the correct city name when search button is clicked', async () => {
    // Create a mock function to listen to the custom event
    const mockCitySearchHandler = vi.fn();
    window.addEventListener('citySearch', mockCitySearchHandler);

    // Render the CityInputForm component (Astro component as HTML)
    render(<CityInputForm />);

    // Get input field and button elements
    const cityInput = screen.getByPlaceholderText('Enter city name');
    const searchButton = screen.getByText('Search');

    // Simulate typing a city name in the input field
    await fireEvent.update(cityInput, 'New York');

    // Simulate clicking the search button
    await fireEvent.click(searchButton);

    // Check if the custom event is fired with the correct city name
    expect(mockCitySearchHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          cityName: 'New York'
        }
      })
    );
  });

  it('does not dispatch event if input is empty', async () => {
    // Create a mock function to listen to the custom event
    const mockCitySearchHandler = vi.fn();
    window.addEventListener('citySearch', mockCitySearchHandler);

    // Render the CityInputForm component (Astro component as HTML)
    render(<CityInputForm />);

    // Get input field and button elements
    const cityInput = screen.getByPlaceholderText('Enter city name');
    const searchButton = screen.getByText('Search');

    // Simulate leaving the input empty and clicking the search button
    await fireEvent.click(searchButton);

    // Check that the event handler was not called since the input is empty
    expect(mockCitySearchHandler).not.toHaveBeenCalled();
  });
});

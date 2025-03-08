import { describe, it, expect, vi } from 'vitest';

// Mock the fetch function to simulate an API response
globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      cod: 200,
      name: 'Test City',
      sys: { country: 'US' },
      main: { temp: 72 },
    }),
  })
);

describe('Weather Component', () => {
  it('should display weather data for a city', async () => {
    // Mock DOM elements (simulate the environment)
    document.body.innerHTML = `
      <section class="backdrop-blur-md bg-white/50">
        <h1>Temp: <span class="temp">Temp</span>°<span class="unit">F</span></h1>
        <h2>City: <span class="city">City</span></h2>
        <h4>Country: <span class="country">Country</span></h4>
        <button id="toggleUnit">Switch to Celsius</button>
      </section>
    `;

    // Import the component's script (to execute the script)
    const script = document.createElement('script');
    script.innerHTML = `
      const apiKey = "fake-api-key"; // Mock API key for testing
      let units = 'imperial';
      const nameOfCity = document.querySelector('.city');
      const tempOfCity = document.querySelector('.temp');
      const countryOfCity = document.querySelector('.country');
      const unitOfTemp = document.querySelector('.unit');
      const toggleUnitButton = document.getElementById('toggleUnit');
      
      async function fetchWeather(cityName) {
        const response = await fetch(\`https://api.openweathermap.org/data/2.5/weather?q=\${cityName}&units=\${units}&appid=\${apiKey}\`);
        const data = await response.json();
        if (data.cod === 200) {
          if (nameOfCity) nameOfCity.textContent = data.name;
          if (tempOfCity) tempOfCity.textContent = data.main.temp;
          if (countryOfCity) countryOfCity.textContent = data.sys.country;
          if (unitOfTemp) unitOfTemp.textContent = units === 'imperial' ? 'F' : 'C';
        } else {
          alert('City not found');
        }
      }
      
      window.addEventListener('citySearch', (event) => {
        const cityName = event.detail.cityName;
        fetchWeather(cityName);
      });
      
      if (toggleUnitButton) {
        toggleUnitButton.addEventListener('click', () => {
          units = units === 'imperial' ? 'metric' : 'imperial';
          if (toggleUnitButton) {
            toggleUnitButton.textContent = units === 'imperial' ? 'Celsius' : 'Fahrenheit';
          }
          const cityName = nameOfCity?.textContent;
          if (cityName) {
            fetchWeather(cityName);
          }
        });
      }
    `;
    document.head.appendChild(script);

    // Trigger the citySearch event
    const event = new CustomEvent('citySearch', {
      detail: { cityName: 'Test City' },
    });
    window.dispatchEvent(event);

    // Wait for the weather data to be displayed
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check if the city and temperature are updated
    expect(document.querySelector('.city').textContent).toBe('Test City');
    expect(document.querySelector('.temp').textContent).toBe('72');
    expect(document.querySelector('.country').textContent).toBe('US');
    expect(document.querySelector('.unit').textContent).toBe('F');
  });

  it('should toggle temperature unit when button is clicked', async () => {
    // Mock DOM elements
    document.body.innerHTML = `
      <section class="backdrop-blur-md bg-white/50">
        <h1>Temp: <span class="temp">Temp</span>°<span class="unit">F</span></h1>
        <h2>City: <span class="city">City</span></h2>
        <h4>Country: <span class="country">Country</span></h4>
        <button id="toggleUnit">Switch to Celsius</button>
      </section>
    `;

    // Import the component's script
    const script = document.createElement('script');
    script.innerHTML = `
      const apiKey = "fake-api-key";
      let units = 'imperial';
      const nameOfCity = document.querySelector('.city');
      const tempOfCity = document.querySelector('.temp');
      const countryOfCity = document.querySelector('.country');
      const unitOfTemp = document.querySelector('.unit');
      const toggleUnitButton = document.getElementById('toggleUnit');
      
      async function fetchWeather(cityName) {
        const response = await fetch(\`https://api.openweathermap.org/data/2.5/weather?q=\${cityName}&units=\${units}&appid=\${apiKey}\`);
        const data = await response.json();
        if (data.cod === 200) {
          if (nameOfCity) nameOfCity.textContent = data.name;
          if (tempOfCity) tempOfCity.textContent = data.main.temp;
          if (countryOfCity) countryOfCity.textContent = data.sys.country;
          if (unitOfTemp) unitOfTemp.textContent = units === 'imperial' ? 'F' : 'C';
        } else {
          alert('City not found');
        }
      }
      
      window.addEventListener('citySearch', (event) => {
        const cityName = event.detail.cityName;
        fetchWeather(cityName);
      });
      
      if (toggleUnitButton) {
        toggleUnitButton.addEventListener('click', () => {
          units = units === 'imperial' ? 'metric' : 'imperial';
          if (toggleUnitButton) {
            toggleUnitButton.textContent = units === 'imperial' ? 'Celsius' : 'Fahrenheit';
          }
          const cityName = nameOfCity?.textContent;
          if (cityName) {
            fetchWeather(cityName);
          }
        });
      }
    `;
    document.head.appendChild(script);

    // Trigger the citySearch event
    const event = new CustomEvent('citySearch', {
      detail: { cityName: 'Test City' },
    });
    window.dispatchEvent(event);

    // Wait for the weather data to be displayed
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Click the toggle button to change unit
    const toggleButton = document.getElementById('toggleUnit');
    toggleButton?.click();

    // Wait for the temperature unit to change
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check if the unit text has been updated
    expect(document.querySelector('.unit').textContent).toBe('C');
    expect(toggleButton?.textContent).toBe('Switch to Fahrenheit');
  });
});

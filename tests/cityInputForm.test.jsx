import { render } from '@astro/test-utils';
import CityInput from '../src/components/CityInput.astro';

describe('City Input Form', () => {
  it('dispatches citySearch event with the correct city name when search button is clicked', () => {
    const { getByPlaceholderText, getByText } = render(<CityInput />);
    const input = getByPlaceholderText('Enter city name');
    const button = getByText('Search');

    input.value = 'London';
    button.click();

    expect(someEventHandler).toHaveBeenCalledWith('London');
  });

  it('does not dispatch event if input is empty', () => {
    const { getByPlaceholderText, getByText } = render(<CityInput />);
    const input = getByPlaceholderText('Enter city name');
    const button = getByText('Search');

    input.value = '';
    button.click();

    expect(someEventHandler).not.toHaveBeenCalled();
  });
});

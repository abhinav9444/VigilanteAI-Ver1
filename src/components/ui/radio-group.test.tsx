
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioGroup, RadioGroupItem } from './radio-group';

describe('RadioGroup', () => {
  it('should render a radio group and handle selection', () => {
    const onValueChange = jest.fn();
    render(
      <RadioGroup onValueChange={onValueChange}>
        <RadioGroupItem value="option1" id="option1" />
        <label htmlFor="option1">Option 1</label>
        <RadioGroupItem value="option2" id="option2" />
        <label htmlFor="option2">Option 2</label>
      </RadioGroup>
    );

    const option1 = screen.getByLabelText('Option 1');
    const option2 = screen.getByLabelText('Option 2');

    fireEvent.click(option1);
    expect(onValueChange).toHaveBeenCalledWith('option1');

    fireEvent.click(option2);
    expect(onValueChange).toHaveBeenCalledWith('option2');
  });
});

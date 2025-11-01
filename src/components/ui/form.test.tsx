
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './form';
import { Input } from './input';
import { Button } from './button';

const TestForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const form = useForm({
    defaultValues: {
      username: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          rules={{ required: 'Username is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

describe('Form', () => {
  it('should render a form and handle submission', async () => {
    const onSubmit = jest.fn();
    render(<TestForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await screen.findByRole('button', { name: /submit/i }); // Wait for submission
    expect(onSubmit).toHaveBeenCalledWith({ username: 'testuser' }, expect.anything());
  });

  it('should display a validation error', async () => {
    const onSubmit = jest.fn();
    render(<TestForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});


import { cn } from './utils';

describe('cn', () => {
  it('should merge tailwind classes', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should override conflicting tailwind classes', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('should handle conditional classes', () => {
    expect(cn('bg-red-500', false && 'bg-blue-500')).toBe('bg-red-500');
  });
});

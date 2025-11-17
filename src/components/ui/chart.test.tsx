
import { render, screen } from '@testing-library/react';
import { ChartContainer } from './chart';
import { BarChart, Bar } from 'recharts';
import React from 'react';

// Mock the recharts library to prevent warnings and errors in JSDOM
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div className="recharts-responsive-container">{children}</div>
    ),
    BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});


const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
};

describe('Chart', () => {
  it('should render a chart without crashing', () => {
    render(
      <ChartContainer config={chartConfig}>
        <BarChart data={chartData}>
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        </BarChart>
      </ChartContainer>
    );

    // A simple check to ensure the component renders. We'll check for the container.
    expect(screen.getByRole('region')).toBeInTheDocument();
  });
});

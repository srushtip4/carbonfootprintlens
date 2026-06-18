/**
 * Memoized chart wrapper to prevent unnecessary Recharts rerenders.
 */
import React, { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../constants';

interface ChartData {
  name: string;
  value: number;
}

interface OptimizedPieChartProps {
  data: ChartData[];
  title: string;
}

export const OptimizedPieChart = React.memo(({ data, title }: OptimizedPieChartProps) => {
  const memoizedData = useMemo(() => data, [JSON.stringify(data)]);
  
  return (
    <div>
      <h3 className="font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={memoizedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}kg`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {memoizedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}kg CO2`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

OptimizedPieChart.displayName = 'OptimizedPieChart';

interface OptimizedBarChartProps {
  data: ChartData[];
  title: string;
  xAxisKey?: string;
}

export const OptimizedBarChart = React.memo(({ data, title, xAxisKey = 'name' }: OptimizedBarChartProps) => {
  const memoizedData = useMemo(() => data, [JSON.stringify(data)]);
  
  return (
    <div>
      <h3 className="font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={memoizedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip formatter={(value) => `${value}kg CO2`} />
          <Legend />
          <Bar dataKey="value" fill="#22c55e" name="CO2 (kg)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

OptimizedBarChart.displayName = 'OptimizedBarChart';

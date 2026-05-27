import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const BinDisposalLineChart = ({ data = [] }) => {
  // Ensure chart shows every month in the year (Jan - Dec).
  // Build a month-indexed array and fill missing months with zero counts.
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const counts = new Array(12).fill(0);
  let detectedYear = null;

  if (Array.isArray(data)) {
    const monthRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i;
    const yearRegex = /(20\d{2})/;

    data.forEach(item => {
      const raw = item?.month?.toString?.() || '';
      const cnt = Number(item?.count) || 0;
      const mMatch = raw.match(monthRegex);
      const yMatch = raw.match(yearRegex);

      if (yMatch) detectedYear = detectedYear || Number(yMatch[1]);
      if (mMatch) {
        const short = mMatch[1].slice(0, 3);
        const idx = monthNames.findIndex(m => m.toLowerCase() === short.toLowerCase());
        if (idx >= 0) counts[idx] += cnt;
      } else {
        // Try parsing full date strings as fallback
        const parsed = Date.parse(raw);
        if (!isNaN(parsed)) {
          const d = new Date(parsed);
          detectedYear = detectedYear || d.getFullYear();
          counts[d.getMonth()] += cnt;
        }
      }
    });
  }

  const chartData = monthNames.map((mn, idx) => ({
    month: detectedYear ? `${mn} ${detectedYear}` : mn,
    count: counts[idx]
  }));

  // Compute a reasonable Y max so the line has some headroom
  const maxCount = Math.max(...counts, 0);
  const yMax = Math.max(10, Math.ceil(maxCount * 1.1));

  return (
    <div className="bg-white p-4 rounded-lg lg:w-full w-[95%] lg:h-96 h-72">
      <h2 className="text-lg font-semibold text-zinc-700 mb-4 pl-5">Bin Disposals Over Time</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#555', fontSize: 12 }}
            axisLine={false}
          />
          <YAxis
            domain={[0, yMax]}
            tick={{ fill: '#555', fontSize: 12 }}
            tickCount={6}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              borderColor: '#008236',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ paddingBottom: '10px' }}
          />
          <Line
            type="monotone"
            dataKey="count"
            name="Bin Disposals"
            stroke="#008236"
            strokeWidth={2}
            dot={{ stroke: '#008236', strokeWidth: 2, r: 4, fill: '#fff' }}
            activeDot={{ r: 6, fill: '#008236' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BinDisposalLineChart;
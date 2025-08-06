import './ByColorChart.css';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { chartColors } from '@renderer/constants';
import { Movie } from '@renderer/types';
import { useEffect, useState } from 'react';

export function ByColorChart({ movieList }: { movieList: Movie[] }) {
  const [compiledColors, setCompiledColors] = useState<{ color: string; amount: number }[]>();

  useEffect(() => {
    async function fetchData() {
      if (movieList) {
        const colors = aggregrateData(movieList);
        setCompiledColors(colors);
      }
    }
    fetchData();
  }, [movieList]);

  return (
    <div className="StatContainer">
      <div className="StatHeader">Movies By Color</div>
      {compiledColors && (
        <div className="ChartContainer">
          <PieChart width={250} height={250}>
            <Tooltip />
            <Pie data={compiledColors} dataKey="amount" nameKey="color" fill="#8884d8">
              {compiledColors.map((entry, index) => (
                <Cell key={index} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      )}
    </div>
  );

  function aggregrateData(data: Movie[]) {
    let colors: { color: string; amount: number }[] = [
      { color: 'B/W', amount: 0 },
      { color: 'Color', amount: 0 }
    ];

    data.forEach((result) => {
      if (result.Color !== null) {
        const index = colors.findIndex((color) => {
          const translatedColor = result.Color ? 'Color' : 'B/W';
          return color.color === translatedColor;
        });
        colors[index].amount++;
      }
    });
    return colors;
  }
}

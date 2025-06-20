import './ByGenreChart.css';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { chartColors } from '@renderer/constants';
import { Movie } from '@renderer/types';
import { useEffect, useState } from 'react';

export function ByGenreChart({ movieList }: { movieList: Movie[] }) {
  const [compiledGenres, setCompiledGenres] = useState<{ genre: string; amount: number }[]>();

  useEffect(() => {
    async function fetchData() {
      if (movieList) {
        const genres = aggregrateData(movieList);
        setCompiledGenres(genres);
      }
    }
    fetchData();
  }, [movieList]);

  return (
    <div className="StatContainer">
      <div className="StatHeader">Movies By Genre</div>
      {compiledGenres && (
        <div className="ChartContainer">
          <PieChart width={250} height={250}>
            <Tooltip />
            <Pie data={compiledGenres} dataKey="amount" nameKey="genre" fill="#8884d8">
              {compiledGenres.map((entry, index) => (
                <Cell key={index} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      )}
    </div>
  );

  function aggregrateData(data: Movie[]) {
    let genres: { genre: string; amount: number }[] = [];
    let existingGenres: string[] = [];

    data.forEach((result) => {
      if (result.Genre) {
        if (existingGenres.includes(result.Genre)) {
          const index = genres.findIndex((genre) => {
            return genre.genre === result.Genre;
          });
          genres[index].amount++;
        } else {
          existingGenres.push(result.Genre);
          genres.push({ genre: result.Genre, amount: 1 });
        }
      }
    });
    return genres;
  }
}

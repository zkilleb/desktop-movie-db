import axios from 'axios';

export const BASE_URL = 'https://api.themoviedb.org/3';

export function generateTMDBParams(req, apiKey) {
  return {
    params: {
      api_key: apiKey,
      language: 'en-US',
      query: req.keyword,
      year: req.year,
      page: 1,
      include_adult: true
    }
  };
}

export async function getTMDBMovieIdByKeyword(keyword: string, year: number) {
  try {
    const result = await axios.get(
      `${BASE_URL}/search/movie`,
      generateTMDBParams({ keyword, year }, localStorage.getItem('tmdbApi'))
    );
    return result.data.results[0];
  } catch (e) {
    console.log(e);
    return {};
  }
}

export async function getTMDBRecommendations(id: string) {
  try {
    const result = await axios.get(
      `${BASE_URL}/movie/${id}/recommendations`,
      generateTMDBParams({ id }, localStorage.getItem('tmdbApi'))
    );
    return [...result.data.results.splice(0, 8)];
  } catch (e) {
    console.log(e);
    return [];
  }
}

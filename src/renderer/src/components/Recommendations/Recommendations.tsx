import { Tooltip } from '@mui/material';
import { useState } from 'react';
import './Recommendations.css';
import { Recommendation } from '@renderer/types/Recommendation';
import { PosterModal } from '../PosterModal/PosterModal';

export function Recommendations({ recommendations }: { recommendations: Recommendation[] }) {
  const [posterOpen, setPosterOpen] = useState(false);
  const [posterData, setPosterData] = useState<{ posterPath: string; title: string }>();

  return (
    <>
      {posterOpen && posterData && (
        <PosterModal
          posterPath={posterData.posterPath}
          open={posterOpen}
          handleClose={() => setPosterOpen(!posterOpen)}
          title={posterData.title}
        />
      )}

      <div className="Recommendations">
        <div className="RecommendationHeader">Similar Films:</div>
        <div className="RecommendationHeader">
          {recommendations &&
            recommendations.map((recommend: Recommendation) => {
              return (
                <div key={JSON.stringify(recommend)} className="RecommendInfo">
                  <Tooltip title={recommend.title}>
                    <img
                      onClick={() => {
                        setPosterOpen(true);
                        setPosterData({
                          posterPath: recommend.poster_path,
                          title: recommend.title
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                      className="RecommendationPoster"
                      src={`https://image.tmdb.org/t/p/original${recommend.poster_path}`}
                      alt={`${recommend.title} poster`}
                      width="106.7"
                      height="160"
                    />
                  </Tooltip>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

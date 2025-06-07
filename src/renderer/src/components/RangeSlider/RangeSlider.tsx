import './RangeSlider.css';
import { Slider } from '@mui/material';

export function RangeSlider({
  title,
  marks,
  min,
  max,
  onChangeCallback,
  value
}: {
  title: string;
  marks: { value: number; label: number | string }[] | boolean;
  min: number;
  max: number;
  onChangeCallback: (newValue: number[]) => void;
  value: number[];
}) {
  return (
    <>
      <div className="ColorFilterHeader">{title}</div>
      <div style={{ width: '90%' }}>
        <Slider
          style={{ color: '#00b020' }}
          valueLabelDisplay="auto"
          step={1}
          min={min}
          max={max}
          marks={marks}
          value={value}
          onChange={(event: Event, newValue: number | number[]) =>
            onChangeCallback(newValue as number[])
          }
        />
      </div>
    </>
  );
}

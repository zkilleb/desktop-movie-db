export class FilterParams {
  title?: string;
  genre?: string;
  color?: string;
  studio?: string;
  language?: string;
  director?: string;
  rating?: string;
  releaseYear?: number[];
  runtime?: number[];
  releaseYearMarks?:
    | false
    | {
        value: number;
        label: number;
      }[];
  runtimeMarks?:
    | false
    | {
        value: number;
        label: string;
      }[];
}

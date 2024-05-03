export enum Charttype {
    Bar,
    Bubble,
    Doughnut,
    Line,
    Pie,
    PolarArea,
    Radar,
    Scatter,
  }
export interface ChartData {
  labels: string[];
  datasets: { data: number[] }[];
}

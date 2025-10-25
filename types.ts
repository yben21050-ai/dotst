export interface Dot {
  x: number;
  y: number;
}

export interface Project {
  id: string;
  name: string;
  dots: Dot[];
  lastModified: number;
  backgroundImage?: {
    src: string;
    width: number;
    height: number;
  };
  lineStyle?: 'straight' | 'curved';
  dotSize?: number;
  lineThickness?: number;
  dotColor?: string;
  lineColor?: string;
  showLines?: boolean;
}
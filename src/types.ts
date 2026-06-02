export interface Whiskey {
  id: string;
  title: string;
  region: string;
  category: string;
  link: string;
  flavour: string;
  pricePaid: number;
  myRating: number;
  avgRating: number;
  priceGbp: number;
  country: string;
}

export interface DashboardFilters {
  search: string;
  countries: string[];
  flavours: string[];
  categories: string[];
  regions: string[];
  minPricePaid: number;
  maxPricePaid: number;
  minMyRating: number;
  maxMyRating: number;
}

export interface ChartDataItem {
  name: string;
  value: number;
  secondaryValue?: number;
  color?: string;
  extra?: any;
}

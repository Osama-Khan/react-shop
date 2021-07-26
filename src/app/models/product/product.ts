export default interface Product {
  id: number;
  code: string;
  title: string;
  description: string;
  highlights: string[];
  price: number;
  rating: number | null;
  stock: number;
  category: string;
  images: any;
}

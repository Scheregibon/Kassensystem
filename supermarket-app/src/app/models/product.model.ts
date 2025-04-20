export interface ProductModel {
    id: number; // represents the barcode of provided product
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  inStock: boolean;
  rating?: number;
  tags?: string[];
  quantity?: number;
}

export interface ProductModel {
    id: number; //wichtig für den Barcode Scanner
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  inStock: boolean;
  rating?: number; // z. B. 4.5 Sterne
  tags?: string[]; // z. B. ["bio", "getreidefrei"]
}

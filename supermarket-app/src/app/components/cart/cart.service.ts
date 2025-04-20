import { Injectable } from '@angular/core';
import { ProductModel } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: ProductModel[] = [];

  addToCart(product: ProductModel): void {
    const existingProduct = this.cart.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1; // Erhöhe die Menge
      console.log(`Menge von ${existingProduct.name} erhöht: ${existingProduct.quantity}`);
    } else {
      this.cart.push({ ...product, quantity: 1 }); // Neues Produkt mit Menge 1 hinzufügen
      console.log(`Produkt hinzugefügt: ${product.name}`);
    }
  }

  getCart(): ProductModel[] {
    return this.cart;
  }
  // Entfernt ausgewählte Produkte aus den
  removeFromCart(productId: number): void {
    const index = this.cart.findIndex((product) => product.id === productId);
    if (index !== -1) {
      const product = this.cart[index];
      if (product.quantity && product.quantity > 1) {
        product.quantity--; // Reduziere die Menge
        console.log(`Menge von ${product.name} reduziert: ${product.quantity}`);
      } else {
        console.log(`Produkt entfernt: ${product.name}`);
        this.cart.splice(index, 1); // Entferne das Produkt, wenn die Menge 1 ist
      }
    } else {
      console.log(`Produkt mit ID ${productId} nicht im Warenkorb gefunden.`);
    }

    }

}

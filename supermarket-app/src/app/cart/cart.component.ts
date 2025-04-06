import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductModel } from '../productModel';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  cart: ProductModel[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
  }

  addToCart(product: ProductModel): void {
    this.cartService.addToCart(product);
    this.cart = this.cartService.getCart(); // Aktualisiere die lokale Warenkorb-Liste
  }
  
  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.cart = this.cartService.getCart(); // Aktualisiere die lokale Warenkorb-Liste
  }
  
  getTotalPrice(): number {
    return this.cart.reduce((total, product) => total + product.price * (product.quantity || 1), 0);
  }
}
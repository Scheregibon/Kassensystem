import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Input } from '@angular/core';
import { ProductModel } from '../productModel';
import { CartService } from '../cart/cart.service';


@Component({
  selector: 'app-product',
  imports: [CommonModule,],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
 
export class ProductComponent {
  @Input() products: ProductModel[] = [];

  constructor(private cartService: CartService) {}

  addToCart(product: ProductModel): void {
    this.cartService.addToCart(product);
    console.log(`${product.name} wurde dem Warenkorb hinzugefügt.`);
  }
}
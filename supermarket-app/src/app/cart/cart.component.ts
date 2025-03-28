import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductModel } from '../productModel';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  @Input() cartItems: ProductModel[] = [];
}
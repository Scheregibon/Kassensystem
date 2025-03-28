import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Input } from '@angular/core';
import { ProductModel } from '../productModel';


@Component({
  selector: 'app-product',
  imports: [CommonModule,],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
    
  addToCart(product: any): void {
    console.log('Product added to cart:', product);
}
@Input() products: ProductModel[] = []; // Erwartet eine Liste von Produkten

} 
import { Component, EventEmitter, Output } from '@angular/core';
import { AppComponent } from '../../app.component';
import { CartService } from '../cart/cart.service';
import { Input } from '@angular/core';
import { ProductModel } from '../../models/product.model';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  constructor(private cartService: CartService, private appComponent: AppComponent) {}

  addToCart(productId: string): void {
    const id = parseInt(productId, 10);
    const product = this.appComponent.productList.find((p) => p.id === id);
    if (product) {
      this.cartService.addToCart(product);
    } else {
      console.log(`Produkt mit ID ${productId} nicht gefunden.`);
    }
  }
}

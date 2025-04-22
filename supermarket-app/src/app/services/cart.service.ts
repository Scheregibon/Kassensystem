import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ProductModel } from '../models/product.model';

export interface CartItem {
  product: ProductModel;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/basket';
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  public cartItems$ = this.cartItemsSubject.asObservable();

  // HTTP options with credentials
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) {
    this.loadBasketFromApi();
  }

  loadBasketFromApi(): void {
    this.http.get<ProductModel[]>(this.apiUrl, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error loading basket:', error);
          return of([]);
        })
      )
      .subscribe(products => {
        this.processProductList(products || []);
      });
  }

  private processProductList(products: ProductModel[]): void {
    // Create a map to track products with their quantities
    const productMap: { [productId: number]: { product: ProductModel; count: number } } = {};

    // Process all products from the list
    products.forEach(product => {
      if (!product) return; // Skip null entries

      const productId = product.id;

      // Initialize if not exists
      if (!productMap[productId]) {
        productMap[productId] = {
          product: product,
          count: 0
        };
      }

      // If the price is positive, count as added item
      // If the price is zero or negative, count as removed item
      if (product.price > 0) {
        productMap[productId].count += 1;
      } else {
        // Removed item (price is zero or negative)
        productMap[productId].count -= 1;
      }
    });

    // Convert map to cart items array
    this.cartItems = [];
    for (const productId in productMap) {
      const { product, count } = productMap[productId];
      // Only include products with positive count
      if (count > 0) {
        this.cartItems.push({
          product: {...product, price: Math.abs(product.price)}, // Ensure price is positive
          quantity: count
        });
      }
    }

    this.cartItemsSubject.next([...this.cartItems]);
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  addToCart(product: ProductModel): void {
    this.http.post<ProductModel[]>(`${this.apiUrl}/add`, product, { withCredentials: true })
      .subscribe(products => {
        this.processProductList(products || []);
      });
  }

  removeFromCart(productId: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      this.http.post<ProductModel[]>(`${this.apiUrl}/removeSpecific`, item.product, { withCredentials: true })
        .subscribe(products => {
          this.processProductList(products || []);
        });
    }
  }

  clearCart(): void {
    this.clearCartRecursively(this.getItemCount());
  }

  private clearCartRecursively(itemsLeft: number): void {
    if (itemsLeft <= 0) {
      this.cartItems = [];
      this.cartItemsSubject.next([]);
      return;
    }

    this.http.post<ProductModel[]>(`${this.apiUrl}/removeLast`, {}, { withCredentials: true })
      .subscribe(products => {
        this.clearCartRecursively(itemsLeft - 1);
      });
  }

  completeCheckout(): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/complete`, {}, { withCredentials: true })
      .pipe(
        tap(success => {
          if (success) {
            console.log(this.cartItems)
            this.cartItems = [];
            this.cartItemsSubject.next([]);
          }
        }),
        catchError(error => {
          console.error('Error completing checkout:', error);
          return of(false);
        })
      );
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  getItemCount(): number {
    return this.cartItems.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }
}

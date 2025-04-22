import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(this.productUrl, {
      observe: 'response',
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error('Error loading products:', error);
        return of(null);
      }),
      map(response => response?.body || [])
    );
  }

  getProductsByCategory(category: string): Observable<ProductModel[]> {
    const url = category === 'Alle'
      ? this.productUrl
      : `${this.productUrl}/category/${category}`;

    return this.http.get<ProductModel[]>(url, {
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error(`Error loading ${category} products:`, error);
        return of([]);
      })
    );
  }
}

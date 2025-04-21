import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ProductModel } from './models/product.model';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductComponent } from './components/product/product.component';
import { CartService } from './services/cart.service';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    CartComponent,
    NgOptimizedImage,
  ]
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  username = '';
  productList: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];
  loading = false;
  scoMode = true; // default after log in
  checkoutMode = false;
  paymentComplete = false;

  constructor(
    private authService: AuthService,
    public cartService: CartService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Check authentication status
    this.authService.isAuthenticated$.subscribe(
      (isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.loadProducts();
        }
      }
    );

    // subscribe to username
    this.authService.username$.subscribe(username => {
      this.username = username;
    });
  }

  onLoginSuccess(): void {
    console.log("Login success received!");
    // No need to manually set isAuthenticated as the subscription will handle it
    this.loadProducts();
  }

  toggleScoMode(): void {
    this.scoMode = !this.scoMode;
    console.log("Mode switched to:", this.scoMode ? "SCO Mode" : "Search Mode");
  }

  completePayment(): void {
    this.paymentComplete = true;
  }

  // restart user-flow
  startNewCustomerSession(): void {
    this.checkoutMode = false;
    this.paymentComplete = false;
  }

  toggleCheckoutMode(): void {
    this.checkoutMode = !this.checkoutMode;
  }

  loadProducts(): void {
    this.loading = true;
    this.http.get<ProductModel[]>('http://localhost:8080/api/products', {
      observe: 'response',
      withCredentials: true // Add this to include auth cookies
    })
      .pipe(
        catchError(error => {
          console.error('Error loading products:', error);
          this.loading = false;
          return of(null);
        }),
        map(response => {
          if (!response) return [];
          return response.body || [];
        })
      )
      .subscribe(products => {
        this.productList = products;
        this.filteredProducts = [...this.productList];
        this.loading = false;
      });
  }

  filterProducts(category: string, event: Event): void {
    event.preventDefault();
    this.loading = true;

    const endpoint = category === 'Alle'
      ? 'http://localhost:8080/api/products'
      : `http://localhost:8080/api/products/category/${category}`;

    // Add artificial delay of 1 second
    setTimeout(() => {
      this.http.get<ProductModel[]>(endpoint, {
        withCredentials: true
      })
        .pipe(
          catchError(error => {
            console.error(`Error loading ${category} products:`, error);
            this.loading = false;
            return of([]);
          })
        )
        .subscribe(products => {
          this.filteredProducts = products;
          this.loading = false;
        });
    }, 300); // Simulate network delay
  }

  logout() {
    this.authService.logout();
  }

  addToCart(product: ProductModel): void {
    // Add animation effect for feedback
    const productElements = document.querySelectorAll('.product-tile');
    productElements.forEach(el => {
      if ((el as HTMLElement).textContent?.includes(product.name)) {
        el.classList.add('added-to-cart');
        setTimeout(() => {
          el.classList.remove('added-to-cart');
        }, 300);
      }
    });

    // Log for now (will be implemented later)
    console.log('Product added to cart:', product);

    // Add this when you implement cart functionality:
    // this.cartService.addToCart(product);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ProductModel } from './models/product.model';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { ViewStateService, ViewMode } from './services/view-state.service';
import { finalize } from 'rxjs/operators';

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

  // View state properties
  get scoMode(): boolean {
    return this.viewStateService.getViewMode() === 'sco';
  }

  get searchMode(): boolean {
    return this.viewStateService.getViewMode() === 'search';
  }

  get checkoutMode(): boolean {
    return this.viewStateService.getViewMode() === 'checkout';
  }

  get paymentComplete(): boolean {
    return this.viewStateService.getViewMode() === 'paymentComplete';
  }

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    public cartService: CartService,
    private viewStateService: ViewStateService
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

    // Subscribe to username
    this.authService.username$.subscribe(username => {
      this.username = username;
    });

    // Subscribe to loading state
    this.viewStateService.loading$.subscribe(isLoading => {
      this.loading = isLoading;
    });
  }

  onLoginSuccess(): void {
    console.log("Login success received!");
    this.loadProducts();
  }

  toggleScoMode(): void {
    const newMode: ViewMode = this.scoMode ? 'search' : 'sco';
    this.viewStateService.setViewMode(newMode);
    console.log("Mode switched to:", newMode);
  }
  completePayment(): void {
    this.viewStateService.setLoading(true);
    this.cartService.completeCheckout().subscribe(
      success => {
        this.viewStateService.setLoading(false);
        if (success) {
          this.viewStateService.setViewMode('paymentComplete');
        } else {
          console.error('Checkout failed');
          // Show error message
        }
      },
      error => {
        this.viewStateService.setLoading(false);
        console.error('Checkout error:', error);
      }
    );
  }

  // Restart user-flow
  startNewCustomerSession(): void {
    this.viewStateService.setViewMode('search');
  }

  toggleCheckoutMode(): void {
    const newMode: ViewMode = this.checkoutMode ? 'search' : 'checkout';
    this.viewStateService.setViewMode(newMode);
  }

  loadProducts(): void {
    this.viewStateService.setLoading(true);
    this.productService.getAllProducts()
      .pipe(finalize(() => this.viewStateService.setLoading(false)))
      .subscribe(products => {
        this.productList = products;
        this.filteredProducts = [...this.productList];
      });
  }

  filterProducts(category: string, event: Event): void {
    event.preventDefault();
    this.viewStateService.setLoading(true);

    // Add artificial delay for UX feedback
    setTimeout(() => {
      this.productService.getProductsByCategory(category)
        .pipe(finalize(() => this.viewStateService.setLoading(false)))
        .subscribe(products => {
          this.filteredProducts = products;
        });
    }, 300);
  }

  logout(): void {
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

    // Add to cart
    this.cartService.addToCart(product);
    console.log('Product added to cart:', product);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { CartComponent } from './components/cart/cart.component';
import { NgOptimizedImage } from '@angular/common';
import { ProductModel } from './models/product.model';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { ViewStateService } from './services/view-state.service';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    SearchBarComponent,
    CartComponent
  ]
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  username = '';
  loading = false;
  productList: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];

  // View state getters
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
    public cartService: CartService,
    private viewStateService: ViewStateService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication status
    this.authService.isAuthenticated$.subscribe(
      isAuthenticated => this.isAuthenticated = isAuthenticated
    );

    // Subscribe to username
    this.authService.username$.subscribe(
      username => this.username = username
    );

    // Subscribe to loading state
    this.viewStateService.loading$.subscribe(
      isLoading => this.loading = isLoading
    );

    // Load products
    this.loadProducts();
  }

  loadProducts(): void {
    this.viewStateService.setLoading(true);
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.productList = products;
        this.filteredProducts = [...products];
        this.viewStateService.setLoading(false);
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        this.viewStateService.setLoading(false);
      }
    });
  }

  filterProducts(category: string, event: Event): void {
    event.preventDefault();
    this.viewStateService.setLoading(true);

    setTimeout(() => {
      this.productService.getProductsByCategory(category).subscribe({
        next: (products) => {
          this.filteredProducts = products;
          this.viewStateService.setLoading(false);
        },
        error: (error) => {
          console.error(`Failed to load ${category} products:`, error);
          this.viewStateService.setLoading(false);
        }
      });
    }, 250);
  }

  // Event handlers
  onLoginSuccess() {
    this.isAuthenticated = true;

    this.cartService.clearCart();

    this.loadProducts();

    this.viewStateService.setViewMode('search');
  }

  toggleScoMode(): void {
    this.viewStateService.toggleScoMode();
  }

  toggleCheckoutMode(): void {
    this.viewStateService.toggleCheckoutMode();
  }

  onProductFound(product: ProductModel): void {
    this.cartService.addToCart(product);
  }

  onPaymentComplete(success: boolean): void {
    if (success) {
      this.viewStateService.setViewMode('paymentComplete');
    } else {
      console.error('Checkout failed');
    }
  }

  startNewCustomerSession(): void {
    this.viewStateService.resetToSearchMode();
  }

  handleAddToCart(product: ProductModel): void {
    this.cartService.addToCart(product);
  }

  completeCheckout(): void {
    this.cartService.completeCheckout().subscribe({
      next: (success) => {
        if (success) {
          this.viewStateService.setViewMode('paymentComplete');
          console.log('Checkout successful!');
        } else {
          console.error('Checkout failed');
        }
      },
      error: (error) => {
        console.error('Error during checkout:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}

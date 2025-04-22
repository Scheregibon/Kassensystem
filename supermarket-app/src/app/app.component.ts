import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
    LoginComponent,
    CartComponent,
    NgOptimizedImage,
  ]
})
export class AppComponent implements OnInit, AfterViewChecked {
  @ViewChild('searchInput') searchInput!: ElementRef;

  isAuthenticated = false;
  username = '';
  productList: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];
  loading = false;
  searchId: number | null = null;
  searchError: string | null = null;
  private shouldFocus = false;

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
          this.shouldFocus = true;
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

    // Subscribe to view mode changes to handle search input focus
    this.viewStateService.viewMode$.subscribe(mode => {
      if (mode === 'search' || mode === 'sco') {
        this.shouldFocus = true;
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldFocus && this.searchInput) {
      try {
        this.searchInput.nativeElement.focus();
        this.shouldFocus = false;
      } catch (err) {
        console.error('Error focusing search input:', err);
      }
    }
  }

  onLoginSuccess(): void {
    console.log("Login success received!");
    this.loadProducts();
    this.shouldFocus = true;
  }

  toggleScoMode(): void {
    const newMode: ViewMode = this.scoMode ? 'search' : 'sco';
    this.viewStateService.setViewMode(newMode);
    console.log("Mode switched to:", newMode);
    this.shouldFocus = true;
  }

  completePayment(): void {
    this.viewStateService.setLoading(true);
    this.cartService.completeCheckout().subscribe({
      next: success => {
        this.viewStateService.setLoading(false);
        if (success) {
          this.viewStateService.setViewMode('paymentComplete');
        } else {
          console.error('Checkout failed');
        }
      },
      error: error => {
        this.viewStateService.setLoading(false);
        console.error('Checkout error:', error);
      }
    });
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
      .subscribe({
        next: (products) => {
          this.productList = products;
          this.filteredProducts = [...this.productList];
        },
        error: (error) => {
          console.error('Failed to load products:', error);
        }
      });
  }

  filterProducts(category: string, event: Event): void {
    event.preventDefault();
    this.viewStateService.setLoading(true);

    this.productService.getProductsByCategory(category)
      .pipe(finalize(() => this.viewStateService.setLoading(false)))
      .subscribe({
        next: (products) => {
          this.filteredProducts = products;
        },
        error: (error) => {
          console.error(`Failed to load ${category} products:`, error);
        }
      });
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

  // Handle product search by ID - only triggered by Enter key
  searchProduct(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (!this.searchId) {
      this.searchError = "Bitte geben Sie eine Produkt-ID ein";
      this.refocusInput();
      return;
    }

    this.searchError = null;
    this.viewStateService.setLoading(true);

    this.productService.getProductById(this.searchId)
      .pipe(finalize(() => {
        this.viewStateService.setLoading(false);
        this.refocusInput();
      }))
      .subscribe({
        next: (product) => {
          if (product) {
            this.addToCart(product);
            this.searchId = null; // Clear the input after successful search
          }
        },
        error: (error) => {
          console.error('Error searching product:', error);
          this.searchError = `Produkt mit ID ${this.searchId} nicht gefunden`;
        }
      });
  }

  private refocusInput(): void {
    this.shouldFocus = true;
  }
}

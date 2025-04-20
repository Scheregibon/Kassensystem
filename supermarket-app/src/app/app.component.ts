import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ProductModel } from './models/product.model';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductComponent } from './components/product/product.component';
import { CartService } from './components/cart/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    CartComponent,
    ProductComponent
  ]
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  productList: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];
  loading = false;
  scoMode = true; // default after log in
  constructor(
    private authService: AuthService,
    public cartService: CartService
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

  loadProducts(): void {
    // Load all products (replace with your actual data loading logic)
    this.loading = true;

    // Remove the setTimeout and just load the products immediately
    this.productList = [];
    this.filteredProducts = [...this.productList];
    this.loading = false;
  }

  filterProducts(category: string, event: Event): void {
    event.preventDefault();
    this.loading = true;

    if (category === 'Alle') {
      this.filteredProducts = this.productList;
    } else {
      this.filteredProducts = this.productList.filter(p => p.category === category);
    }
    this.loading = false;
  }

  logout() {
    this.authService.logout();
  }
}

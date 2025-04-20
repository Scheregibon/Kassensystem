import { Component, OnInit } from '@angular/core';
                import { CommonModule } from '@angular/common';
                import { AuthService } from './services/auth.service';
                import { ProductModel } from './models/product.model';
                import { LoginComponent } from './components/login/login.component';
                import { SearchBarComponent } from './components/search-bar/search-bar.component';
                import { CartComponent } from './components/cart/cart.component';
                import { ProductComponent } from './components/product/product.component';

                @Component({
                  selector: 'app-root',
                  templateUrl: './app.component.html',
                  styleUrls: ['./app.component.css'],
                  standalone: true,
                  imports: [
                    CommonModule,
                    LoginComponent,
                    SearchBarComponent,
                    CartComponent,
                    ProductComponent
                  ]
                })
                export class AppComponent implements OnInit {
                  isAuthenticated = false;
                  productList: ProductModel[] = [];
                  filteredProducts: ProductModel[] = [];
                  loading = false;

                  constructor(private authService: AuthService) {}

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

                  loadProducts(): void {
                    // Load all products (replace with your actual data loading logic)
                    this.loading = true;

                    // Remove the setTimeout and just load the products immediately
                    this.productList = [];
                    this.filteredProducts = [...this.productList];
                    this.loading = false;

                    // When you integrate with real API, it will look like:
                    // this.productService.getAllProducts().subscribe({
                    //   next: (products) => {
                    //     this.productList = products;
                    //     this.filteredProducts = [...this.productList];
                    //     this.loading = false;
                    //   },
                    //   error: (err) => {
                    //     console.error('Failed to load products', err);
                    //     this.loading = false;
                    //   }
                    // });
                  }

                  filterProducts(category: string, event: Event): void {
                    event.preventDefault();
                    this.loading = true;

                    // Remove the setTimeout and filter immediately
                    if (category === 'Alle') {
                      this.filteredProducts = this.productList;
                    } else {
                      this.filteredProducts = this.productList.filter(p => p.category === category);
                    }
                    this.loading = false;
                  }
                }

import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductModel } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Input() focusOnInit = false;
  @Input() showInstructions = false;
  @Input() showScanAnimation = false;
  @Output() productFound = new EventEmitter<ProductModel>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  searchQuery: string = '';
  searchError: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.searchInput?.nativeElement?.focus();
  }

  searchProduct() {
    if (!this.searchQuery.trim()) {
      this.searchError = 'Bitte geben Sie eine Produkt-ID oder einen Barcode ein';
      this.searchInput.nativeElement.focus();
      return;
    }

    const productId = Number(this.searchQuery.trim());

    if (isNaN(productId)) {
      this.searchError = 'Die Produkt-ID muss eine Zahl sein';
      this.searchInput.nativeElement.focus();
      return;
    }

    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        if (product) {
          this.productFound.emit(product);
          this.searchQuery = '';
          this.searchError = '';

          this.searchInput.nativeElement.focus();
        } else {
          this.searchError = 'Produkt nicht gefunden';
          this.searchInput.nativeElement.focus();
        }
      },
      error: (error) => {
        this.searchError = 'Das Produkt konnte nicht gefunden werden';
        this.searchInput.nativeElement.focus();
      }
    });
  }
}

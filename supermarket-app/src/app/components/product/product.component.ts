import { Component, Input } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { ProductModel } from '../../models/product.model';

    @Component({
      selector: 'app-product',
      templateUrl: './product.component.html',
      styleUrls: ['./product.component.css'],
      standalone: true,
      imports: [CommonModule]
    })
    export class ProductComponent {
      @Input() products: ProductModel[] = [];
    }

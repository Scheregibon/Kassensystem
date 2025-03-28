import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchBarComponent } from './shared/search-bar/search-bar.component';
import { LoginComponent } from './pages/login/login.component';
import { CartComponent } from './cart/cart.component';
import { ProductComponent } from './product/product.component';
import { ProductModel } from './productModel';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SearchBarComponent, LoginComponent, CartComponent, ProductComponent, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PetShop';

  // Produktinformationen welche an product.component durch @Input() weitergegeben werden
  productList: ProductModel[] = [
    {
      id: 101,
      name: 'Bio-Hundetrockenfutter',
      description: 'Getreidefreies Trockenfutter für ausgewachsene Hunde mit Rindfleisch.',
      price: 24.99,
      category: 'Hunde',
      imageUrl: 'assets/images/hundetrockenfutter.jpg',
      inStock: true,
      rating: 4.7,
      tags: ['bio', 'getreidefrei', 'hund']
    },
    {
      id: 102,
      name: 'Premium-Katzenfutter mit Lachs',
      description: 'Saftiges Nassfutter mit echtem Lachs, reich an Omega-3.',
      price: 1.89,
      category: 'Katzen',
      imageUrl: 'assets/images/katzenfutter-lachs.jpg',
      inStock: true,
      rating: 4.8,
      tags: ['nassfutter', 'lachs', 'katze']
    },
    {
      id: 103,
      name: 'Kleintier-Müsli',
      description: 'Gesundes Mixfutter für Hamster, Meerschweinchen und Co.',
      price: 3.49,
      category: 'Kleintier',
      imageUrl: 'assets/images/kleintier-muesli.jpg',
      inStock: true,
      rating: 4.3,
      tags: ['kleintiere', 'müsli', 'vitaminreich']
    },
    {
      id: 104,
      name: 'Barf-Rindfleisch-Mix (tiefgekühlt)',
      description: '100% Rindfleisch für BARF-Fütterung bei Hunden.',
      price: 5.99,
      category: 'Hunde',
      imageUrl: 'assets/images/barf-rind.jpg',
      inStock: false,
      rating: 4.6,
      tags: ['barf', 'rind', 'hund']
    },
    {
      id: 105,
      name: 'Getreidefreies Trockenfutter für Katzen',
      description: 'Mit Huhn und Süßkartoffeln – für sensible Mägen.',
      price: 12.99,
      category: 'Katzen',
      imageUrl: 'assets/images/katzenfutter-huhn.jpg',
      inStock: true,
      rating: 4.4,
      tags: ['getreidefrei', 'katze', 'spezialfutter']
    },
    {
      id: 106,
      name: 'Fischflocken für Zierfische',
      description: 'Nährstoffreiche Flocken für tropische Aquarienfische.',
      price: 4.25,
      category: 'Fisch',
      imageUrl: 'assets/images/fischflocken.jpg',
      inStock: true,
      rating: 4.1,
      tags: ['fisch', 'aquarium', 'flakes']
    },
    {
      id: 107,
      name: 'Kräuter-Heu für Nager',
      description: 'Duftendes Heu mit Kräutermix für Kaninchen und Meerschweinchen.',
      price: 2.99,
      category: 'Kleintier',
      imageUrl: 'assets/images/kraeuter-heu.jpg',
      inStock: true,
      rating: 4.5,
      tags: ['heu', 'nager', 'bio']
    },
    {
      id: 108,
      name: 'Snacksticks für Hunde – Lamm',
      description: 'Leckere Zwischenmahlzeit für alle Hunderassen.',
      price: 3.79,
      category: 'Hunde',
      imageUrl: 'assets/images/hundesnacks-lamm.jpg',
      inStock: true,
      rating: 4.9,
      tags: ['hund', 'snack', 'lamm']
    },
    {
      id: 109,
      name: 'Wellensittich-Körnerfutter',
      description: 'Ausgewogene Körnermischung für gesunde Vögel.',
      price: 2.49,
      category: 'Vögel',
      imageUrl: 'assets/images/wellensittich-futter.jpg',
      inStock: true,
      rating: 4.2,
      tags: ['vogel', 'körner', 'vitamine']
    }
  ];

// funktioniert gerade irgendwie nicht ka warum, die Logik sollte eigentlich passen
  // Filter für die Produktliste
  filteredProducts: ProductModel[] = [...this.productList];

  //methode zum filtern der Produkte
  filterProducts(category: string): void {
    if (category === 'Alle') {
      this.filteredProducts = [...this.productList]; // Zeige alle Produkte
    } else {
      this.filteredProducts = this.productList.filter(p => p.category === category); // Filtere nach Kategorie
    }
  }

//Methode wird noch überarbeitet

  /*cart: ProductModel[] = [];

  addToCart(event: any) {
    const Id: number = event as number;
    const product = this.productList.find(p => p.id === Id);
    if (product) {
      this.cart.push(product);
    }
  }*/


}
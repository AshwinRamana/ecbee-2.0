import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card" [ngClass]="theme">
      
      <!-- IMAGE SECTION -->
      <div class="card-img-container" [routerLink]="['/product', productId]">
        <img [src]="getImageUrl()" (error)="onImgError($event)" [alt]="productName">
        
        <!-- Overlays for specific themes -->
        <div class="overlay" *ngIf="theme === 'fashion'" (click)="$event.stopPropagation()">
           <button (click)="addToCart()">Add +</button>
        </div>
      </div>

      <!-- DETAILS SECTION -->
      <div class="card-body">
        
        <!-- Fashion: Minimal -->
        <ng-container *ngIf="theme === 'fashion'">
          <h3 class="product-title" [routerLink]="['/product', productId]">{{ productName }}</h3>
          <p class="product-price">{{ price | currency }}</p>
        </ng-container>

        <!-- Electronics: Specs & Tech feel -->
        <ng-container *ngIf="theme === 'electronics'">
          <h3 class="product-title" [routerLink]="['/product', productId]">{{ productName }}</h3>
          <ul class="specs">
            <li>High Performance</li>
            <li>Energy Efficient</li>
          </ul>
          <div class="actions">
            <span class="price">{{ price | currency }}</span>
            <button class="btn-tech" (click)="addToCart()">Add to Cart</button>
          </div>
        </ng-container>

        <!-- Grocery: Compact -->
        <ng-container *ngIf="theme === 'grocery'">
          <h4 class="product-title" [routerLink]="['/product', productId]">{{ productName }}</h4>
          <div class="grocery-row">
            <span class="price">{{ price | currency }}</span>
            <button class="btn-add" (click)="addToCart()">+</button>
          </div>
        </ng-container>

        <!-- Restaurant: Descriptive -->
        <ng-container *ngIf="theme === 'restaurant'">
          <div class="restaurant-row">
            <h3 class="product-title" [routerLink]="['/product', productId]">{{ productName }}</h3>
            <span class="price">{{ price | currency }}</span>
          </div>
          <p class="desc">Freshly prepared with premium ingredients.</p>
          <button class="btn-order" (click)="addToCart()">Add to Order</button>
        </ng-container>

      </div>
    </div>
  `,
  styles: [`
    .card { background: white; border-radius: 8px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; position: relative; cursor: pointer; }
    .card-img-container { position: relative; overflow: hidden; cursor: pointer; }
    img { width: 100%; height: 250px; object-fit: cover; display: block; }
    .product-title { cursor: pointer; }
    .product-title:hover { text-decoration: underline; }

    /* FASHION */
    .card.fashion { border: none; border-radius: 0; }
    .card.fashion img { height: 350px; }
    .card.fashion .card-body { text-align: center; padding: 1rem; }
    .card.fashion .product-title { font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; margin: 0.5rem 0; }
    .card.fashion .product-price { font-weight: bold; color: #555; }
    .card.fashion:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    .card.fashion .overlay { position: absolute; bottom: -50px; left: 0; right: 0; background: rgba(255,255,255,0.9); padding: 10px; transition: bottom 0.3s; display: flex; justify-content: center; z-index: 10; }
    .card.fashion:hover .overlay { bottom: 0; }
    .card.fashion button { border: 1px solid var(--primary-color); background: var(--primary-color); color: var(--accent-color); padding: 5px 15px; cursor: pointer; }

    /* ELECTRONICS */
    .card.electronics { border: 1px solid #1f4068; background: #0b1c2c; color: #00d2d3; }
    .card.electronics img { height: 200px; padding: 20px; box-sizing: border-box; background: white; object-fit: contain; }
    .card.electronics .card-body { padding: 1rem; }
    .card.electronics .specs { font-size: 0.8rem; color: #8892b0; padding-left: 1.2rem; margin: 0.5rem 0; }
    .card.electronics .actions { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; }
    .btn-tech { background: transparent; border: 1px solid var(--accent-color); color: var(--accent-color); padding: 5px 10px; cursor: pointer; z-index: 10; }
    .btn-tech:hover { background: var(--accent-color); color: var(--primary-color); }

    /* GROCERY */
    .card.grocery { border: 1px solid #e0e0e0; box-shadow: none; }
    .card.grocery img { height: 150px; object-fit: contain; padding: 10px; }
    .card.grocery .card-body { padding: 10px; }
    .card.grocery .product-title { font-size: 0.9rem; margin: 0 0 5px 0; }
    .grocery-row { display: flex; justify-content: space-between; align-items: center; }
    .btn-add { background: var(--primary-color); color: var(--accent-color); border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; z-index: 10; }

    /* RESTAURANT */
    .card.restaurant { box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    .card.restaurant img { height: 200px; }
    .card.restaurant .card-body { padding: 1.5rem; }
    .restaurant-row { display: flex; justify-content: space-between; align-items: baseline; mb: 0.5rem; }
    .card.restaurant .desc { color: #777; font-size: 0.9rem; font-style: italic; }
    .btn-order { width: 100%; background: var(--primary-color); color: var(--accent-color); border: none; padding: 10px; margin-top: 10px; cursor: pointer; border-radius: 4px; z-index: 10; }
  `]
})
export class ProductCardComponent {
  @Input() productId: string = '';
  @Input() theme: string = 'fashion';
  @Input() productName: string = 'Product';
  @Input() price: number = 99.99;
  @Input() imageId: number = 1;
  @Input() cdnBaseUrl: string = '';
  @Input() mainImage?: string;

  constructor(private cartService: CartService) { }

  getImageUrl(): string {
    if (this.mainImage) return this.mainImage;
    return `${this.cdnBaseUrl}/product_${this.theme}_${this.imageId}.jpg`;
  }

  onImgError(event: any) {
    if (this.mainImage) {
      event.target.src = 'https://via.placeholder.com/300x300?text=Product';
    } else {
      // Fallback to placeholder if default themed image fails too
      event.target.src = 'https://via.placeholder.com/300x300?text=Product';
    }
  }

  addToCart() {
    this.cartService.addToCart({
      id: this.productId || `${this.theme}-${this.imageId}`,
      name: this.productName,
      price: this.price,
      quantity: 1,
      image: this.getImageUrl()
    });
  }
}

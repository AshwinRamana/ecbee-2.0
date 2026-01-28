import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { TenantConfigService } from '../../core/services/tenant-config.service';
import { CartService } from '../../core/services/cart.service';
import { Observable, switchMap, catchError, of, map } from 'rxjs';
import { TenantConfig } from '../../core/models/tenant.model';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="product-detail-page" *ngIf="content$ | async as content" [ngClass]="content.config.theme">
      
      <!-- LOADING STATE -->
      <div *ngIf="!content.product" class="loading">
        <div class="spinner"></div>
      </div>

      <!-- MAIN CONTENT -->
      <div *ngIf="content.product" class="container">
        
        <!-- PRODUCT TEMPLATE LOGIC -->
        <ng-container [ngSwitch]="content.config.uiSettings?.productTemplate || content.config.theme">

            <!-- FASHION LAYOUT -->
            <div *ngSwitchCase="'fashion'" class="layout-fashion">
               <div class="media-gallery">
                  <img [src]="content.product.images[0]" alt="Product" class="main-img">
               </div>
               <div class="info-panel">
                  <nav class="breadcrumb">Home / {{ content.product.category }} / {{ content.product.name }}</nav>
                  <h1>{{ content.product.name }}</h1>
                  <p class="price">{{ content.product.price | currency }}</p>
                  <p class="description">{{ content.product.description }}</p>
                  
                  <div class="selectors">
                     <h3>Select {{ content.config.uiSettings?.variantLabel || 'Size' }}</h3>
                     <div class="size-chips">
                        <span *ngFor="let v of content.product.variants" 
                              class="chip" 
                              [class.active]="selectedVariant === v"
                              (click)="selectedVariant = v">
                          {{ v }}
                        </span>
                     </div>
                  </div>

                  <div class="qty-selector">
                    <button (click)="changeQty(-1)">-</button>
                    <span>{{ quantity }}</span>
                    <button (click)="changeQty(1)">+</button>
                  </div>

                  <button class="add-btn" (click)="addToCart(content.product)">Add to Bag</button>

                  <div class="details-accordion">
                     <details open>
                        <summary>Composition & Care</summary>
                        <ul>
                           <li *ngFor="let item of content.product.specifications | keyvalue">
                              <strong>{{ item.key }}:</strong> {{ item.value }}
                           </li>
                        </ul>
                     </details>
                  </div>
               </div>
            </div>

            <!-- ELECTRONICS LAYOUT -->
            <div *ngSwitchCase="'electronics'" class="layout-electronics">
                <div class="left">
                    <img [src]="content.product.images[0]" class="hero-tech-img">
                </div>
                <div class="right">
                    <span class="badge">Performance Peak</span>
                    <h1>{{ content.product.name }}</h1>
                    <div class="rating">⭐⭐⭐⭐⭐ ({{ content.product.rating }})</div>
                    <div class="tech-price">{{ content.product.price | currency }}</div>
                    
                    <div class="selectors tech-selectors" *ngIf="content.product.variants?.length">
                         <h3>Available {{ content.config.uiSettings?.variantLabel || 'Models' }}</h3>
                         <div class="size-chips">
                            <span *ngFor="let v of content.product.variants" 
                                  class="chip tech-chip" 
                                  [class.active]="selectedVariant === v"
                                  (click)="selectedVariant = v">
                              {{ v }}
                            </span>
                         </div>
                    </div>

                    <div class="spec-grid">
                       <div class="spec-item" *ngFor="let item of content.product.specifications | keyvalue">
                          <label>{{ item.key }}</label>
                          <span>{{ item.value }}</span>
                       </div>
                    </div>

                    <div class="qty-selector tech-qty">
                      <button (click)="changeQty(-1)">-</button>
                      <span>{{ quantity }}</span>
                      <button (click)="changeQty(1)">+</button>
                    </div>

                    <div class="action-row">
                        <button class="buy-now">Buy Now</button>
                        <button class="add-cart" (click)="addToCart(content.product)">Add to Cart</button>
                    </div>

                    <div class="reviews-section">
                        <h3>User Reviews</h3>
                        <div class="review-card" *ngFor="let r of content.product.reviews">
                            <div class="rev-header">
                                <strong>{{ r.user }}</strong>
                                <span>{{ r.rating }}/5</span>
                            </div>
                            <p>{{ r.comment }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- GROCERY LAYOUT -->
            <div *ngSwitchCase="'grocery'" class="layout-grocery">
                <div class="grocery-card">
                    <div class="img-wrap">
                        <img [src]="content.product.images[0]">
                        <span class="fresh-tag">100% Organic</span>
                    </div>
                    <div class="details">
                        <h1>{{ content.product.name }}</h1>
                        <p class="sub-text">{{ content.product.category }}</p>
                        <div class="price-row">
                            <span class="big-price">{{ content.product.price | currency }}</span>
                            <span class="unit">/ {{ content.config.uiSettings?.variantLabel || 'pack' }}</span>
                        </div>
                        
                        <div class="nutritional-info">
                            <strong>Freshness Guarantee</strong>
                            <p>Delivered from local farms within 24 hours of harvest.</p>
                        </div>

                        <div class="qty-control">
                            <button (click)="changeQty(-1)">-</button>
                            <span>{{ quantity }}</span>
                            <button (click)="changeQty(1)">+</button>
                        </div>
                        <button class="grocery-add" (click)="addToCart(content.product)">Add to Basket</button>
                    </div>
                </div>
            </div>

            <!-- RESTAURANT LAYOUT -->
            <div *ngSwitchCase="'restaurant'" class="layout-menu">
            <div class="menu-header" [style.backgroundImage]="'url(' + content.product.images[0] + ')'">
                <div class="overlay">
                    <h1>{{ content.product.name }}</h1>
                </div>
            </div>
            <div class="menu-content">
                <div class="main-desc">
                    <h2>The Dish</h2>
                    <p>{{ content.product.longDescription }}</p>
                </div>
                <div class="meta-side">
                    <h3>Details</h3>
                    <div class="price-menu">{{ content.product.price | currency }}</div>
                    
                    <div class="qty-selector menu-qty">
                      <button (click)="changeQty(-1)">-</button>
                      <span>{{ quantity }}</span>
                      <button (click)="changeQty(1)">+</button>
                    </div>

                    <div class="ingredients">
                        <strong>Ingredients:</strong>
                        <p>{{ content.product.specifications?.Ingredients }}</p>
                    </div>
                    <div class="allergens" *ngIf="content.product.specifications?.Allergens">
                        <strong>⚠️ Allergens:</strong> {{ content.product.specifications?.Allergens }}
                    </div>
                    <button class="order-btn" (click)="addToCart(content.product)">Add to Order</button>
                </div>
            </div>
        </div>

        </ng-container>
      </div>
    </div>
  `,
    styles: [`
    .product-detail-page { min-height: 100vh; padding: 40px 0; background: #fff; font-family: 'Inter', sans-serif; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

    /* SHARED */
    .qty-selector { display: flex; align-items: center; gap: 20px; margin: 20px 0; }
    .qty-selector button { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #ddd; background: #fff; cursor: pointer; font-size: 1.2rem; }
    .qty-selector span { font-size: 1.2rem; font-weight: 700; width: 30px; text-align: center; }

    /* FASHION */
    .layout-fashion { display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px; }
    .main-img { width: 100%; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .layout-fashion h1 { font-size: 36px; font-weight: 800; margin: 10px 0; }
    .price { font-size: 24px; color: #333; margin-bottom: 30px; }
    .chip { display: inline-block; padding: 10px 20px; border: 1px solid #ddd; margin-right: 10px; cursor: pointer; border-radius: 4px; transition: 0.3s; }
    .chip:hover, .chip.active { border-color: #000; background: #000; color: #fff; }
    .add-btn { width: 100%; padding: 20px; background: #000; color: #fff; border: none; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin: 20px 0; cursor: pointer; }
    .breadcrumb { color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }

    /* ELECTRONICS */
    .layout-electronics { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .hero-tech-img { width: 100%; border-radius: 20px; background: #f9f9f9; padding: 40px; }
    .tech-price { font-size: 32px; font-weight: 900; color: #00d2d3; margin: 20px 0; }
    .spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f4f7f9; padding: 20px; border-radius: 12px; margin: 20px 0; }
    .spec-item label { display: block; filter: contrast(0.5); font-size: 12px; text-transform: uppercase; font-weight: 700; }
    .action-row { display: flex; gap: 20px; margin: 30px 0; }
    .buy-now { flex: 1; padding: 15px; background: #00d2d3; border: none; color: #fff; font-weight: 800; border-radius: 8px; cursor: pointer; }
    .add-cart { flex: 1; padding: 15px; background: #000; border: none; color: #fff; font-weight: 800; border-radius: 8px; cursor: pointer; }
    .tech-qty button { border-color: #00d2d3; color: #00d2d3; }

    /* GROCERY */
    .layout-grocery { display: flex; justify-content: center; }
    .grocery-card { display: grid; grid-template-columns: 1fr 1.2fr; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.08); width: 900px; }
    .img-wrap { position: relative; background: #f8fdfa; display: flex; align-items: center; justify-content: center; padding: 40px; }
    .img-wrap img { width: 100%; }
    .fresh-tag { position: absolute; top: 20px; left: 20px; background: #2ecc71; color: #fff; padding: 6px 15px; border-radius: 50px; font-size: 12px; font-weight: 800; }
    .grocery-card .details { padding: 40px 60px; }
    .big-price { font-size: 48px; font-weight: 900; color: #2ecc71; }
    .unit { color: #888; font-weight: 600; margin-left: 10px; }
    .qty-control { display: flex; align-items: center; gap: 20px; margin-top: 30px; }
    .qty-control button { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #2ecc71; background: #fff; color: #2ecc71; cursor: pointer; font-size: 1.2rem; font-weight: 700; }
    .qty-control span { font-size: 1.5rem; font-weight: 800; }
    .grocery-add { background: #2ecc71; width: 100%; color: #fff; border: none; padding: 20px; border-radius: 16px; font-size: 18px; font-weight: 800; cursor: pointer; margin-top: 30px; box-shadow: 0 10px 20px rgba(46, 204, 113, 0.3); }

    /* MENU/RESTAURANT */
    .layout-menu .menu-header { height: 400px; background-size: cover; background-position: center; border-radius: 20px; display: flex; align-items: flex-end; padding: 60px; color: #fff; margin-bottom: 40px; }
    .layout-menu .overlay { background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); padding: 20px 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); }
    .layout-menu h1 { font-size: 42px; margin: 0; }
    .menu-content { display: grid; grid-template-columns: 1.5fr 1fr; gap: 60px; }
    .price-menu { font-size: 36px; font-weight: 900; margin-bottom: 20px; }
    .menu-qty button { border-color: #e67e22; color: #e67e22; }
    .order-btn { background: #e67e22; color: #fff; border: none; width: 100%; padding: 18px; border-radius: 8px; font-weight: 800; cursor: pointer; margin-top: 30px; }
  `]
})
export class ProductDetailComponent implements OnInit {
    content$: Observable<{ config: TenantConfig, product: any }>;
    quantity: number = 1;
    selectedVariant: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private tenantService: TenantConfigService,
        private cartService: CartService
    ) {
        this.content$ = this.route.params.pipe(
            switchMap(params => this.productService.getProductById(params['id']).pipe(
                catchError(err => {
                    console.error('[ProductDetail] ❌ Product fetch failed:', err);
                    return of(null);
                })
            )),
            switchMap(product => {
                if (product && product.variants && product.variants.length > 0) {
                    this.selectedVariant = product.variants[0];
                }
                return this.tenantService.config.pipe(
                    map(config => ({ config, product }))
                );
            })
        );
    }

    ngOnInit(): void { }

    changeQty(delta: number) {
        this.quantity = Math.max(1, this.quantity + delta);
    }

    addToCart(product: any) {
        const itemName = this.selectedVariant ? `${product.name} (${this.selectedVariant})` : product.name;
        this.cartService.addToCart({
            id: product._id,
            name: itemName,
            price: product.price,
            quantity: this.quantity,
            image: product.images[0]
        });
    }
}

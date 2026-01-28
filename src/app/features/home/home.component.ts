import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantConfigService } from '../../core/services/tenant-config.service';
import { ProductService, SearchParams } from '../../core/services/product.service';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { Observable, switchMap, map, BehaviorSubject, combineLatest, catchError, of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="home-container" *ngIf="content$ | async as content" [ngClass]="content.config.theme">
      
      <!-- HERO GRID LAYOUT (Fashion) -->
      <div *ngIf="(content.config.uiSettings?.homeTemplate || content.config.homeLayout) === 'hero-grid'" class="layout-hero">
        <div class="hero-banner" [style.backgroundImage]="'url(' + (content.config.uiSettings?.bannerUrl || content.config.cdnBaseUrl + '/hero_' + content.config.theme + '.jpg') + ')'">
          <div class="hero-content">
            <h1 class="fade-in">New Collection 2024</h1>
            <p>Elevate your wardrobe with our latest drops.</p>
            <button class="hero-btn">Shop Now</button>
          </div>
        </div>
      </div>

      <!-- CATEGORY NAV / MARKETPLACE LAYOUT (Electronics) -->
      <div *ngIf="(content.config.uiSettings?.homeTemplate || content.config.homeLayout) === 'marketplace'" class="layout-electronics">
        <aside class="sidebar">
          <h3>Tech Explorer</h3>
          <ul class="nav-tree">
            <li class="active">Computing</li>
            <li>Smart Home</li>
            <li>Audio Visual</li>
            <li>Accessories</li>
          </ul>
        </aside>
        <main class="main-content">
          <div class="tech-hero" [style.backgroundImage]="'url(' + (content.config.uiSettings?.bannerUrl || content.config.cdnBaseUrl + '/hero_' + content.config.theme + '.jpg') + ')'">
            <div class="tech-hero-content">
                <h1>Next Gen Power</h1>
                <p>Experience the future of performance today.</p>
                <button class="tech-btn">Discover</button>
            </div>
          </div>
        </main>
      </div>

      <!-- MINIMAL (Grocery/Restaurant) -->
      <div *ngIf="(content.config.uiSettings?.homeTemplate || content.config.homeLayout) === 'minimal'" class="layout-grocery">
        <div class="grocery-hero-row" [style.backgroundImage]="'url(' + (content.config.uiSettings?.bannerUrl || content.config.cdnBaseUrl + '/hero_' + content.config.theme + '.jpg') + ')'">
           <div class="grocery-hero-box">
             <h1>Pure & Natural</h1>
             <p>Farm to table freshness delivered daily.</p>
           </div>
        </div>
      </div>

      <!-- SEARCH & FILTERS TOOLBAR -->
      <div class="toolbar">
         <div class="search-box">
            <input type="text" placeholder="Fuzzy search products..." #searchInput (keyup.enter)="onSearch(searchInput.value)">
            <button (click)="onSearch(searchInput.value)">Search</button>
         </div>
         
         <div class="filter-options">
            <select (change)="onSort($event)" class="sort-select">
               <option value="newest">Newest Arrivals</option>
               <option value="priceAsc">Price: Low to High</option>
               <option value="priceDesc">Price: High to Low</option>
               <option value="ratingDesc">Top Rated</option>
            </select>
         </div>
      </div>

      <div class="product-section">
          <h2>{{ activeSearch ? 'Search Results' : 'Featured Products' }}</h2>
          <div class="divider"></div>
          
          <div [ngClass]="getGridClass(content.config.theme)">
            <app-product-card *ngFor="let p of content.products"
              [productId]="p._id"
              [theme]="content.config.theme"
              [productName]="p.name"
              [price]="p.price"
              [mainImage]="p.images[0]"
              [cdnBaseUrl]="content.config.cdnBaseUrl">
            </app-product-card>
          </div>

          <div *ngIf="content.products.length === 0" class="empty-results">
              <p>No products found matching your search.</p>
              <button (click)="clearFilters()">View All Products</button>
          </div>
      </div>

    </div>
  `,
  styles: [`
    .home-container { max-width: 1400px; margin: 0 auto; padding: 2rem; min-height: 80vh; font-family: 'Inter', sans-serif; }
    h2 { font-weight: 800; font-size: 32px; margin-bottom: 20px; }
    .divider { width: 50px; height: 4px; background: var(--accent-color); margin-bottom: 40px; }
    
    /* TOOLBAR Area */
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; gap: 20px; flex-wrap: wrap; }
    .search-box { flex: 1; display: flex; background: white; padding: 8px; border-radius: 50px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); border: 1px solid #eee; max-width: 600px; }
    .search-box input { flex: 1; border: none; padding: 12px 25px; outline: none; font-size: 16px; border-radius: 50px; }
    .search-box button { background: var(--accent-color); color: white; border: none; padding: 0 30px; border-radius: 50px; font-weight: 800; cursor: pointer; }
    .sort-select { padding: 12px 20px; border-radius: 8px; border: 1px solid #ddd; background: white; font-weight: 600; cursor: pointer; outline: none; }

    /* LAYOUTS */
    .layout-hero { margin-bottom: 4rem; }
    .hero-banner { height: 600px; background-size: cover; background-position: center; border-radius: 20px; display: flex; align-items: center; padding-left: 80px; position: relative; }
    .hero-content { background: white; padding: 60px; border-radius: 12px; max-width: 500px; box-shadow: 25px 25px 0px rgba(0,0,0,0.05); }
    .hero-content h1 { font-size: 52px; font-weight: 900; margin: 0; line-height: 1; }
    .hero-content p { color: #666; margin: 20px 0; font-size: 18px; }
    .hero-btn { background: var(--primary-color); color: var(--accent-color); padding: 16px 40px; border: none; font-weight: 800; cursor: pointer; text-transform: uppercase; letter-spacing: 2px; }

    .layout-electronics { display: flex; gap: 40px; margin-bottom: 4rem; }
    .sidebar { width: 280px; background: #f4f7f9; padding: 30px; border-radius: 20px; height: fit-content; }
    .nav-tree { list-style: none; padding: 0; margin-top: 25px; }
    .nav-tree li { padding: 15px; border-radius: 10px; cursor: pointer; margin-bottom: 8px; transition: 0.3s; font-weight: 500; }
    .nav-tree li:hover, .nav-tree li.active { background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.05); color: #2196f3; font-weight: 700; }
    .tech-hero { flex: 1; height: 400px; border-radius: 20px; background-size: cover; display: flex; align-items: center; padding-left: 60px; }
    .tech-hero-content { background: rgba(10, 25, 47, 0.85); padding: 40px; border-radius: 15px; color: white; backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.1); max-width: 450px; }
    .tech-btn { background: #64ffda; color: #001220; border: none; padding: 12px 30px; border-radius: 8px; font-weight: 800; cursor: pointer; margin-top: 20px; }

    .grocery-hero-row { height: 350px; background-size: cover; background-position: center; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 4rem; }
    .grocery-hero-box { background: white; padding: 40px; text-align: center; border-radius: 15px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); }

    /* GRIDS */
    .grid-standard { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 40px; }
    .grid-electronics { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
    .grid-grocery { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 30px; }

    .empty-results { text-align: center; padding: 60px 0; background: #f9f9f9; border-radius: 20px; margin-top: 20px; }
    .empty-results button { background: var(--primary-color); color: var(--accent-color); border: none; padding: 10px 25px; border-radius: 4px; margin-top: 15px; cursor: pointer; }
  `]
})
export class HomeComponent implements OnInit {
  private searchParams$ = new BehaviorSubject<Partial<SearchParams>>({ sort: 'newest' });
  content$: Observable<{ config: any, products: any[] }>;
  activeSearch: boolean = false;

  constructor(
    public tenantService: TenantConfigService,
    private productService: ProductService
  ) {
    this.content$ = combineLatest([
      this.tenantService.config,
      this.searchParams$
    ]).pipe(
      switchMap(([config, params]) => {
        const tid = config.tenantId || 'T001';
        return this.productService.getProducts({ ...params, tenantId: tid }).pipe(
          map(products => ({ config, products })),
          catchError(err => {
            console.error('[Home] ❌ Products failed to load:', err);
            return of({ config, products: [] });
          })
        );
      })
    );
  }

  ngOnInit(): void { }

  onSearch(term: string) {
    this.activeSearch = !!term.trim();
    const current = this.searchParams$.value;
    this.searchParams$.next({ ...current, search: term.trim() || undefined });
  }

  onSort(event: any) {
    const sortValue = event.target.value;
    const current = this.searchParams$.value;
    this.searchParams$.next({ ...current, sort: sortValue });
  }

  clearFilters() {
    this.activeSearch = false;
    this.searchParams$.next({ sort: 'newest' });
  }

  getGridClass(theme: string): string {
    switch (theme) {
      case 'electronics': return 'grid-electronics';
      case 'grocery': return 'grid-grocery';
      default: return 'grid-standard';
    }
  }
}

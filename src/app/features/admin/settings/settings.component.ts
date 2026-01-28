import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TenantConfigService } from '../../../core/services/tenant-config.service';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { take } from 'rxjs';

@Component({
   selector: 'app-site-customization',
   standalone: true,
   imports: [CommonModule, FormsModule],
   template: `
    <div class="custom-container" *ngIf="config">
      <div class="settings-panel">
         
         <!-- BRANDING SECTION -->
         <section class="config-section">
            <h3>Branding & Identity</h3>
            <p class="section-desc">Manage your storefront's visual identity.</p>
            
            <div class="form-group mb-4">
               <label>Store Name</label>
               <input type="text" [(ngModel)]="config.name" placeholder="e.g. My Awesome Shop">
            </div>

            <div class="form-group mb-4">
               <label>Custom Brand Logo (URL)</label>
               <input type="text" [(ngModel)]="config.branding.logo" placeholder="https://.../logo.png">
               <div class="logo-preview-wrap mt-2" *ngIf="config.branding?.logo">
                  <img [src]="config.branding.logo" class="curr-logo">
                  <p class="asset-hint">Using custom brand logo</p>
               </div>
            </div>

            <div class="form-group mb-4">
               <label>Homepage Banner (URL)</label>
               <input type="text" [(ngModel)]="config.uiSettings.bannerUrl" placeholder="https://.../hero.jpg">
               <p class="asset-hint">This will override the theme default hero image.</p>
            </div>
         </section>

         <!-- UI & EXPERIENCE SECTION -->
         <section class="config-section">
            <h3>UI & Experience</h3>
            <p class="section-desc">Choose how your customers interact with your site.</p>

            <div class="ui-options-grid">
               <div class="form-group">
                  <label>Active Theme</label>
                  <select [(ngModel)]="config.theme" (change)="onThemeChange()">
                     <option value="fashion">Fashion (Elegant Noir)</option>
                     <option value="electronics">Electronics (Neon Tech)</option>
                     <option value="grocery">Grocery (Organic Fresh)</option>
                     <option value="restaurant">Restaurant (Warm Bistro)</option>
                  </select>
               </div>
               
               <div class="form-group">
                  <label>Home Page Layout</label>
                  <select [(ngModel)]="config.uiSettings.homeLayout">
                     <option value="hero-grid">Hero Banner + Grid</option>
                     <option value="category-nav">Split Navigation View</option>
                     <option value="minimal">Minimalist Clean</option>
                  </select>
               </div>

               <div class="form-group">
                  <label>Cart Experience</label>
                  <select [(ngModel)]="config.uiSettings.cartTemplate">
                     <option value="drawer">Side Drawer (Modern)</option>
                     <option value="overlay">Modal Overlay (Classic)</option>
                     <option value="classic">Dedicated Cart Page</option>
                  </select>
               </div>
            </div>
         </section>

         <div class="sticky-footer">
            <button class="btn-save" (click)="saveSettings()" [disabled]="loading">
               {{ loading ? 'Saving...' : 'Deploy Changes' }}
            </button>
         </div>

      </div>

      <!-- LIVE PREVIEW SIDEBAR -->
      <div class="preview-sidebar">
         <div class="preview-sticky">
            <h4>Live Dashboard Preview</h4>
            <div class="device-frame">
               <header [ngClass]="config.theme">
                  <img [src]="config.branding?.logo || (config.cdnBaseUrl + '/logo_' + config.theme + '.png')" class="mini-logo">
                  <div class="mini-nav">Home | Shop | Cart</div>
               </header>
               <main [ngClass]="config.theme">
                  <div class="placeholder-hero">
                     <p>Your New Theme in Action</p>
                  </div>
                  <div class="placeholder-grid">
                     <div class="dot"></div><div class="dot"></div><div class="dot"></div>
                  </div>
               </main>
            </div>
         </div>
      </div>
    </div>
  `,
   styles: [`
    .custom-container { display: grid; grid-template-columns: 1fr 400px; gap: 40px; }
    @media (max-width: 1000px) { .custom-container { grid-template-columns: 1fr; } }

    .settings-panel { background: #fff; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
    .config-section { margin-bottom: 50px; }
    .config-section h3 { margin: 0 0 5px 0; font-size: 20px; font-weight: 800; }
    .section-desc { color: #64748b; font-size: 14px; margin-bottom: 25px; }

    .form-group label { display: block; margin-bottom: 10px; font-size: 13px; font-weight: 700; color: #475569; }
    .form-group input, .form-group select { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; box-sizing: border-box; }
    .mb-4 { margin-bottom: 20px; }

    .logo-preview-wrap { display: flex; align-items: center; gap: 20px; background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px dashed #cbd5e1; }
    .curr-logo { height: 80px; object-fit: contain; }
    .logo-upload p { color: #64748b; font-size: 12px; margin-bottom: 8px; }
    .btn-outline { background: #fff; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; }

    .ui-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
    
    .sticky-footer { position: sticky; bottom: 0; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); padding: 20px 0; margin-top: 40px; border-top: 1px solid #f1f5f9; text-align: right; }
    .btn-save { background: #1a1c1e; color: #fff; border: none; padding: 14px 40px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; }
    .btn-save:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

    /* PREVIEW */
    .preview-sidebar { position: relative; }
    .preview-sticky { position: sticky; top: 120px; }
    .device-frame { border: 12px solid #1a1c1e; border-radius: 30px; overflow: hidden; height: 500px; box-shadow: 0 30px 60px rgba(0,0,0,0.15); }
    
    header { height: 60px; padding: 0 15px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee; }
    header.fashion { background: #000; }
    header.fashion .mini-nav { color: #fff; font-size: 10px; }
    header.electronics { background: #0a192f; border-bottom: 1px solid #00d2d3; }
    header.electronics .mini-nav { color: #00d2d3; font-size: 10px; }
    header.grocery { border-bottom: 2px solid #2ecc71; }
    
    .mini-logo { height: 30px; }
    .asset-hint { font-size: 11px; color: #64748b; margin-top: 5px; }
    .mt-2 { margin-top: 10px; }
    .placeholder-hero { height: 120px; background: #f1f5f9; margin: 15px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #94a3b8; font-weight: 700; background-size: cover; background-position: center; }
    .placeholder-grid { display: flex; gap: 10px; padding: 0 15px; }
    .placeholder-grid .dot { width: 30px; height: 30px; background: #f1f5f9; border-radius: 6px; }
  `]
})
export class SiteCustomizationComponent implements OnInit {
   config: any;
   loading: boolean = false;

   constructor(
      private tenantService: TenantConfigService,
      private adminService: AdminService,
      private authService: AuthService
   ) { }

   ngOnInit(): void {
      this.tenantService.config.pipe(take(1)).subscribe(data => {
         this.config = JSON.parse(JSON.stringify(data)); // Work on a clone
      });
   }

   onThemeChange() {
      // Sync related UI defaults when theme changes
      switch (this.config.theme) {
         case 'fashion': this.config.uiSettings.cartTemplate = 'drawer'; break;
         case 'electronics': this.config.uiSettings.cartTemplate = 'overlay'; break;
         case 'grocery': this.config.uiSettings.cartTemplate = 'classic'; break;
      }
   }

   saveSettings() {
      this.loading = true;
      const user = this.authService.getCurrentUserValue();
      this.adminService.updateTenant(user.tenantId, this.config).subscribe({
         next: () => {
            this.loading = false;
            alert('Site customization updated! Please refresh the storefront to see changes.');
         },
         error: () => this.loading = false
      });
   }
}

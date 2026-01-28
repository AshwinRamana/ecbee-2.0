import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './features/header/header.component';
import { FooterComponent } from './features/footer/footer.component';
import { TenantConfigService } from './core/services/tenant-config.service';
import { StyleEngineService } from './core/services/style-engine.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="app-container" *ngIf="tenantService.config | async as config; else loading">
      
      <div class="theme-wrapper" [ngClass]="isPortal() ? '' : config.theme">
        <app-header *ngIf="!isAuthPage() && !isPortal()"></app-header>
        
        <main class="content">
          <router-outlet></router-outlet>
        </main>
        
        <app-footer *ngIf="!isAuthPage() && !isPortal()"></app-footer>
      </div>

    </div>

    <ng-template #loading>
       <div class="loading-screen">
         <div class="spinner"></div>
       </div>
    </ng-template>
  `,
  styles: [`
    .app-container { min-height: 100vh; display: flex; flex-direction: column; }
    .theme-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
    .content { flex: 1; }
    .loading-screen { height: 100vh; display: flex; justify-content: center; align-items: center; background: #f8f9fa; }
    .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class AppComponent {
  constructor(
    public tenantService: TenantConfigService,
    private styleEngine: StyleEngineService,
    private router: Router
  ) {
    this.tenantService.config.pipe(
      tap(config => {
        if (config.branding) {
          this.styleEngine.applyBrandColors(
            config.branding.primaryColor || '#000000',
            config.branding.secondaryColor || '#ffffff'
          );
        }
      })
    ).subscribe();
  }

  isPortal(): boolean {
    return this.router.url.startsWith('/portal');
  }

  isAuthPage(): boolean {
    const url = this.router.url;
    return url.includes('/login') || url.includes('/register') || url === '/' || url === '';
  }
}

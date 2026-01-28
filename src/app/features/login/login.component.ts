import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TenantConfigService } from '../../core/services/tenant-config.service';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { TenantConfig } from '../../core/models/tenant.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-page" *ngIf="config$ | async as config" 
         [ngClass]="config.uiSettings?.loginTemplate || 'minimal'" 
         [style.backgroundImage]="'url(' + (config.uiSettings?.bannerUrl || config.cdnBaseUrl + '/bg_login_' + config.theme + '.jpg') + ')'">
      
      <div class="color-overlay"></div>

      <!-- TEMPLATE 1: MINIMAL -->
      <div *ngIf="(config.uiSettings?.loginTemplate || 'minimal') === 'minimal'" class="container minimal-style">
        <div class="card">
          <div class="header">
            <img [src]="config.branding?.logo || (config.cdnBaseUrl + '/logo_' + config.theme + '.png')" class="logo" alt="Logo">
            <h2 [style.color]="'var(--primary-color)'">Welcome Back</h2>
            <p>Sign in to your {{ config.name }} account</p>
          </div>
          <form (ngSubmit)="onLogin()">
            <input type="email" name="email" [(ngModel)]="credentials.email" placeholder="Email" required>
            <input type="password" name="password" [(ngModel)]="credentials.password" placeholder="Password" required>
            <button type="submit" class="primary-btn">Sign In</button>
          </form>
          <div class="footer">
            New here? <a routerLink="/register" [style.color]="'var(--primary-color)'">Create Account</a>
          </div>
        </div>
      </div>

      <!-- TEMPLATE 2: GLASS -->
      <div *ngIf="config.uiSettings?.loginTemplate === 'glass'" class="container glass-style">
        <div class="glass-card">
          <img [src]="config.branding?.logo || (config.cdnBaseUrl + '/logo_' + config.theme + '.png')" class="logo" alt="Logo">
          <h2>Sign In</h2>
          <form (ngSubmit)="onLogin()">
            <div class="input-container">
                <input type="email" name="email" [(ngModel)]="credentials.email" placeholder="Email" required>
            </div>
            <div class="input-container">
                <input type="password" name="password" [(ngModel)]="credentials.password" placeholder="Password" required>
            </div>
            <button type="submit" class="glass-btn" [style.background]="'var(--primary-color)'">Login</button>
          </form>
          <p class="footer-text">No account? <a routerLink="/register">Register</a></p>
        </div>
      </div>

      <div *ngIf="config.uiSettings?.loginTemplate === 'split'" class="container split-style">
        <div class="split-left" [style.background-image]="'url(' + (config.uiSettings?.bannerUrl || config.cdnBaseUrl + '/banner_' + config.theme + '.jpg') + ')'">
            <div class="overlay">
                <h1>{{ config.name }}</h1>
                <p>Curated collections just for you.</p>
            </div>
        </div>
        <div class="split-right">
            <div class="form-container">
                <img [src]="config.branding?.logo || (config.cdnBaseUrl + '/logo_' + config.theme + '.png')" class="form-logo" alt="Logo">
                <h2 [style.color]="'var(--primary-color)'">Login</h2>
                <form (ngSubmit)="onLogin()">
                    <label>Email</label>
                    <input type="email" name="email" [(ngModel)]="credentials.email" placeholder="you@example.com" required>
                    <label>Password</label>
                    <input type="password" name="password" [(ngModel)]="credentials.password" placeholder="••••••••" required>
                    <button type="submit" class="split-btn" [style.background]="'var(--primary-color)'">Sign In</button>
                </form>
                <p>Not a member? <a routerLink="/register" [style.color]="'var(--primary-color)'">Join us</a></p>
            </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .login-page { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; font-family: 'Inter', 'Segoe UI', sans-serif; background-size: cover; background-position: center; }
    .color-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.1); z-index: 0; }
    .container { position: relative; z-index: 10; display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; }
    .logo { height: 60px; margin-bottom: 20px; object-fit: contain; display: block; margin-left: auto; margin-right: auto; }
    .form-logo { height: 50px; margin-bottom: 20px; }

    /* --- MINIMAL --- */
    .minimal-style .card { background: white; padding: 50px; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); width: 400px; text-align: center; }
    .minimal-style h2 { font-weight: 800; font-size: 28px; margin-bottom: 10px; }
    .minimal-style p { color: #666; margin-bottom: 30px; }
    .minimal-style input { width: 100%; padding: 14px; margin-bottom: 20px; border: 1px solid #ebebeb; border-radius: 8px; background: #fcfcfc; font-size: 16px; }
    .primary-btn { width: 100%; padding: 16px; background: var(--primary-color); color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 16px; transition: 0.3s; }
    .primary-btn:hover { opacity: 0.9; transform: translateY(-2px); }

    /* --- GLASS --- */
    .glass-style { background: linear-gradient(135deg, rgba(30, 60, 114, 0.4) 0%, rgba(42, 82, 152, 0.4) 100%); }
    .glass-card { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(25px); padding: 50px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.2); width: 400px; text-align: center; color: white; box-shadow: 0 25px 50px rgba(0,0,0,0.2); }
    .glass-style input { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: white; width: 100%; padding: 14px; margin-bottom: 20px; border-radius: 12px; font-size: 16px; outline: none; }
    .glass-style input::placeholder { color: rgba(255,255,255,0.6); }
    .glass-btn { width: 100%; padding: 16px; background: white; color: #1e3c72; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; }

    /* --- SPLIT --- */
    .split-style { display: flex; background: white; }
    .split-left { flex: 1.4; background-size: cover; background-position: center; display: flex; align-items: flex-end; padding: 80px; color: white; }
    .split-left .overlay { background: rgba(0,0,0,0.3); padding: 40px; border-radius: 20px; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); }
    .split-left h1 { font-size: 48px; margin: 0; font-weight: 900; }
    .split-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 60px; }
    .form-container { width: 100%; max-width: 400px; }
    .split-style h2 { font-size: 36px; margin-bottom: 15px; font-weight: 800; }
    .split-style label { display: block; margin-bottom: 8px; font-weight: 600; color: #444; }
    .split-style input { width: 100%; padding: 14px; margin-bottom: 20px; border: 1px solid #f0f0f0; border-radius: 8px; background: #fafafa; font-size: 16px; }
    .split-btn { width: 100%; padding: 16px; background: #1a1a1a; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 16px; }
  `]
})
export class LoginComponent implements OnInit {
  config$: Observable<TenantConfig>;
  credentials = {
    email: '',
    password: '',
    tenantId: ''
  };

  constructor(
    private tenantService: TenantConfigService,
    private authService: AuthService,
    private router: Router
  ) {
    this.config$ = this.tenantService.config;
  }

  ngOnInit() {
    this.config$.subscribe(config => {
      this.credentials.tenantId = config.tenantId || 'T001';
    });
  }

  onLogin() {
    console.log('[Login] Submitting:', this.credentials);
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        console.log('[Login] Success:', res);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('[Login] Error:', err);
        alert('Login Failed: ' + (err.error?.error || 'Unknown error'));
      }
    });
  }
}

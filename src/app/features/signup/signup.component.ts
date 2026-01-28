import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TenantConfigService } from '../../core/services/tenant-config.service';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { TenantConfig } from '../../core/models/tenant.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="signup-page" *ngIf="config$ | async as config" 
         [ngClass]="config.uiSettings?.loginTemplate || 'minimal'" 
         [style.backgroundImage]="'url(' + (config.uiSettings?.bannerUrl || config.cdnBaseUrl + '/bg_login_' + config.theme + '.jpg') + ')'">
      
      <div class="color-overlay"></div>

      <!-- TEMPLATE 1: MINIMAL -->
      <div *ngIf="(config.uiSettings?.loginTemplate || 'minimal') === 'minimal'" class="container minimal-style">
        <div class="card">
          <div class="header">
            <img [src]="config.branding?.logo || (config.cdnBaseUrl + '/logo_' + config.theme + '.png')" class="logo" alt="Logo">
            <h2 [style.color]="'var(--primary-color)'">Join {{ config.name }}</h2>
            <p>Create your account in seconds</p>
          </div>
          <form (ngSubmit)="onSignup()">
            <input type="email" name="email" [(ngModel)]="userData.email" placeholder="Email Address" required>
            <input type="password" name="password" [(ngModel)]="userData.password" placeholder="Password" required>
            <button type="submit" class="primary-btn">Create Account</button>
          </form>
          <div class="footer">
            Already have an account? <a routerLink="/login" [style.color]="'var(--primary-color)'">Sign In</a>
          </div>
        </div>
      </div>

      <!-- TEMPLATE 2: GLASS -->
      <div *ngIf="config.uiSettings?.loginTemplate === 'glass'" class="container glass-style">
        <div class="glass-card">
          <img [src]="config.branding?.logo || (config.cdnBaseUrl + '/logo_' + config.theme + '.png')" class="logo" alt="Logo">
          <h2>Create Account</h2>
          <form (ngSubmit)="onSignup()">
            <div class="input-container">
                <input type="email" name="email" [(ngModel)]="userData.email" placeholder="Email" required>
            </div>
            <div class="input-container">
                <input type="password" name="password" [(ngModel)]="userData.password" placeholder="Password" required>
            </div>
            <button type="submit" class="glass-btn" [style.background]="'var(--primary-color)'">Get Started</button>
          </form>
          <p class="footer-text">Member? <a routerLink="/login">Login here</a></p>
        </div>
      </div>

      <!-- TEMPLATE 3: SPLIT -->
      <div *ngIf="config.uiSettings?.loginTemplate === 'split'" class="container split-style">
        <div class="split-left" [style.background-image]="'url(' + (config.uiSettings?.bannerUrl || config.cdnBaseUrl + '/banner_' + config.theme + '.jpg') + ')'">
            <div class="overlay">
                <h1>{{ config.name }}</h1>
                <p>Elevate your lifestyle with us.</p>
            </div>
        </div>
        <div class="split-right">
            <div class="form-container">
                <img [src]="config.branding?.logo || (config.cdnBaseUrl + '/logo_' + config.theme + '.png')" class="form-logo" alt="Logo">
                <h2 [style.color]="'var(--primary-color)'">Sign Up</h2>
                <form (ngSubmit)="onSignup()">
                    <label>Email</label>
                    <input type="email" name="email" [(ngModel)]="userData.email" placeholder="you@example.com" required>
                    <label>Password</label>
                    <input type="password" name="password" [(ngModel)]="userData.password" placeholder="••••••••" required>
                    <button type="submit" class="split-btn" [style.background]="'var(--primary-color)'">Sign Up</button>
                </form>
                <p>Already a member? <a routerLink="/login" [style.color]="'var(--primary-color)'">Sign In</a></p>
            </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .signup-page { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; font-family: 'Inter', 'Segoe UI', sans-serif; background-size: cover; background-position: center; }
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
export class SignupComponent implements OnInit {
  config$: Observable<TenantConfig>;
  userData = {
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
      this.userData.tenantId = config.tenantId || 'T001';
    });
  }

  onSignup() {
    console.log('[Signup] Submitting:', this.userData);
    this.authService.register(this.userData).subscribe({
      next: (res) => {
        alert('Registration Successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Registration Failed: ' + (err.error?.error || 'Unknown error'));
      }
    });
  }
}

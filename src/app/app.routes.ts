import { Routes } from '@angular/router';
import { featureGuard } from './core/guards/feature.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
        title: 'Login'
    },
    {
        path: 'register',
        loadComponent: () => import('./features/signup/signup.component').then(m => m.SignupComponent),
        title: 'Sign Up'
    },
    {
        path: 'product/:id',
        loadComponent: () => import('./features/products/product-detail.component').then(m => m.ProductDetailComponent),
        title: 'Product Details'
    },
    {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'Home'
    },
    {
        path: 'checkout',
        loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
        title: 'Checkout'
    },
    {
        path: 'order-confirmation',
        loadComponent: () => import('./features/checkout/order-confirmation.component').then(m => m.OrderConfirmationComponent),
        title: 'Order Confirmed'
    },
    {
        path: 'offers',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'Special Offers'
    },
    {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart-page.component').then(m => m.CartPageComponent),
        title: 'My Cart'
    },
    // ADMIN MODULE
    {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
        canActivate: [() => import('./core/guards/role.guard').then(m => m.RoleGuard)],
        data: { roles: ['superadmin', 'clientadmin'] },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
            },
            {
                path: 'products',
                loadComponent: () => import('./features/admin/products/products.component').then(m => m.ProductManagementComponent)
            },
            {
                path: 'customize',
                loadComponent: () => import('./features/admin/settings/settings.component').then(m => m.SiteCustomizationComponent)
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/admin/orders/orders.component').then(m => m.OrderManagementComponent)
            },
            {
                path: 'tenants',
                loadComponent: () => import('./features/admin/tenants/tenants.component').then(m => m.ClientOnboardingComponent),
                data: { roles: ['superadmin'] }
            }
        ]
    },
    {
        path: 'portal',
        loadChildren: () => import('./features/portal/portal.routes').then(m => m.PORTAL_ROUTES)
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];

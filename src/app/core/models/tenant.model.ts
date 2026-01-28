export interface Features {
    login: boolean;
    cart: boolean;
    offers: boolean;
}

export interface TenantConfig {
    domain: string;
    theme: 'fashion' | 'electronics' | 'grocery' | 'restaurant' | 'corporate';
    uiSettings?: {
        homeTemplate: string;
        loginTemplate: 'glass' | 'split' | 'minimal';
        cartTemplate: 'drawer' | 'overlay' | 'classic';
        productTemplate: string;
        checkoutTemplate: string;
        bannerUrl?: string;
        variantLabel?: string;
    };
    branding?: {
        primaryColor: string;
        secondaryColor: string;
        logo?: string;
        brandName?: string;
    };
    package?: 'starter' | 'pro' | 'enterprise';
    billingCycle?: 'monthly' | 'annual';
    features: Features;
    cdnBaseUrl: string;
    name: string;
    tenantId?: string;
    homeLayout?: string; // Fallback
}

import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class StyleEngineService {
    private renderer: Renderer2;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        rendererFactory: RendererFactory2
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    applyBrandColors(primary: string, secondary: string) {
        const styleId = 'brand-styles';
        let styleLink = this.document.getElementById(styleId) as HTMLStyleElement;

        const css = `
      :root {
        --primary-color: ${primary} !important;
        --secondary-color: ${secondary} !important;
        --accent-color: ${primary} !important;
        --btn-primary-bg: ${primary} !important;
        --btn-secondary-bg: ${secondary} !important;
      }
    `;

        if (!styleLink) {
            styleLink = this.renderer.createElement('style');
            styleLink.id = styleId;
            this.renderer.appendChild(this.document.head, styleLink);
        }

        styleLink.textContent = css;
    }
}

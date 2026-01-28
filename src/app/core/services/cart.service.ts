import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems = new BehaviorSubject<CartItem[]>([]);
    public cart$ = this.cartItems.asObservable();

    // Observable for total price
    public total$ = this.cart$.pipe(
        map(items => items.reduce((acc, item) => acc + (item.price * item.quantity), 0))
    );

    // Observable for total count
    public count$ = this.cart$.pipe(
        map(items => items.reduce((acc, item) => acc + item.quantity, 0))
    );

    // Visibility state for Drawer/Modal
    private showCart = new BehaviorSubject<boolean>(false);
    public showCart$ = this.showCart.asObservable();

    constructor() { }

    addToCart(item: CartItem) {
        const currentItems = this.cartItems.value;
        const existingItem = currentItems.find(i => i.id === item.id);

        if (existingItem) {
            // Immobiliaze state pattern (create new array ref)
            const updated = currentItems.map(i =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
            this.cartItems.next(updated);
        } else {
            this.cartItems.next([...currentItems, item]);
        }

        // Auto-open cart on add
        this.openCart();
    }

    removeFromCart(itemId: string) {
        const currentItems = this.cartItems.value;
        this.cartItems.next(currentItems.filter(i => i.id !== itemId));
    }

    updateQuantity(itemId: string, quantity: number) {
        if (quantity < 1) {
            this.removeFromCart(itemId);
            return;
        }
        const currentItems = this.cartItems.value;
        const updated = currentItems.map(i =>
            i.id === itemId ? { ...i, quantity } : i
        );
        this.cartItems.next(updated);
    }

    clearCart() {
        this.cartItems.next([]);
    }

    openCart() { this.showCart.next(true); }
    closeCart() { this.showCart.next(false); }
    toggleCart() { this.showCart.next(!this.showCart.value); }
}

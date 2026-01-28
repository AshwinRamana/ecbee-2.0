import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartService } from './cart.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    getCurrentUserValue() {
        return this.currentUserSubject.value;
    }

    constructor(private http: HttpClient, private cartService: CartService) {
        // Restore session from localStorage on startup
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                this.currentUserSubject.next(JSON.parse(savedUser));
            } catch (e) {
                console.error('Error parsing saved user', e);
                localStorage.removeItem('user');
            }
        }
    }

    get isLoggedIn(): boolean {
        return !!this.currentUserSubject.value;
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/register`, userData);
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
            tap((res: any) => {
                if (res.token && res.user) {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('user', JSON.stringify(res.user));
                    this.currentUserSubject.next(res.user);
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
        this.cartService.clearCart();
    }
}

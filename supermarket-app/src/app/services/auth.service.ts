import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize with null or get from localStorage only in browser
    const initialValue = isPlatformBrowser(this.platformId)
      ? JSON.parse(localStorage.getItem('currentUser') || 'null')
      : null;

    this.currentUserSubject = new BehaviorSubject<any>(initialValue);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    // Create form data for Spring Boot form login
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // Use withCredentials to ensure cookies are sent with the request
    return this.http.post<any>(`${this.apiUrl}/auth/login`, formData, {
      withCredentials: true,
      observe: 'response'
    }).pipe(
      tap(response => {
        const user = { username, authenticated: true };
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  logout() {
    // Only remove from localStorage if in browser environment
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    return this.http.post<any>(`${this.apiUrl}/auth/logout`, {}).pipe(
      catchError(error => {
        return throwError(() => new Error('Logout failed'));
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private usernameSubject = new BehaviorSubject<string>('');
  public username$ = this.usernameSubject.asObservable()
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    // Check if user is already logged in, but only in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const storedAuth = localStorage.getItem('isAuthenticated');
      if (storedAuth === 'true') {
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  login(username: string, password: string): Observable<boolean> {

    console.log('Login method called with username:', username);
    // Create form data
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // For debugging
    console.log('Sending login request to:', `${this.apiUrl}/login`);
    console.log('Username:', username);

    // Set proper headers for form data
    const headers = new HttpHeaders({
      'Accept': 'application/json'
      // Note: Content-Type is automatically set for FormData
    });

    // Send POST request to backend
    return this.http.post<any>(`${this.apiUrl}/login`, formData, {
      headers,
      withCredentials: true
    })
      .pipe(
        map(response => {
          console.log('Login successful:', response);
          this.isAuthenticatedSubject.next(true);
          this.usernameSubject.next(username);

          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('username', username);
            if (response && response.token) {
              localStorage.setItem('authToken', response.token);
            }
          }
          return true;
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error(error.error?.message || 'Login failed. Please check your credentials.'));
        })
      );
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    if (isPlatformBrowser(this.platformId)) {
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
        next: () => console.log('Logout successful'),
        error: (error) => console.error('Logout error:', error)
      });

      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authToken');
    }
  }
}

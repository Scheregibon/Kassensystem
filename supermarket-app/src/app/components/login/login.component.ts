import { Component, EventEmitter, Output } from '@angular/core';
            import { CommonModule } from '@angular/common';
            import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
            import { AuthService } from '../../services/auth.service';

            @Component({
              selector: 'app-login',
              standalone: true,
              imports: [CommonModule, ReactiveFormsModule],
              templateUrl: './login.component.html',
              styleUrls: ['./login.component.css']
            })
            export class LoginComponent {
              @Output() loginSuccess = new EventEmitter<void>();

              loginForm: FormGroup;
              loading = false;
              error = '';

              constructor(
                private formBuilder: FormBuilder,
                private authService: AuthService
              ) {
                this.loginForm = this.formBuilder.group({
                  username: ['', Validators.required],
                  password: ['', Validators.required]
                });
              }

              // Make sure this method is properly connected to your form submit event
              onSubmit(): void {
                console.log('Form submission initiated');

                // Mark form controls as touched to trigger validation messages
                Object.keys(this.loginForm.controls).forEach(key => {
                  const control = this.loginForm.get(key);
                  control?.markAsTouched();
                });

                if (this.loginForm.invalid) {
                  console.log('Form validation failed', this.loginForm.errors);
                  return;
                }

                this.loading = true;
                this.error = '';

                const username = this.loginForm.get('username')?.value;
                const password = this.loginForm.get('password')?.value;

                console.log('Calling auth service with username:', username);

                this.authService.login(username, password)
                  .subscribe({
                    next: () => {
                      console.log('Login successful');
                      this.loading = false;
                      this.loginSuccess.emit();
                    },
                    error: (error) => {
                      console.error('Login error in component:', error);
                      this.error = error.message || 'Login failed';
                      this.loading = false;
                    }
                  });
              }
            }

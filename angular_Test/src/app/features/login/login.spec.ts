import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: { login: jest.Mock };
  let router: { navigate: jest.Mock };

  beforeEach(async () => {
    authService = { login: jest.fn() };
    router = { navigate: jest.fn() };
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
  });

  it('creates the login component', () => {
    expect(component).toBeTruthy();
  });

  it('sends the entered credentials and routes an ADMIN to user management', () => {
    authService.login.mockReturnValue(of({ accessToken: 'admin-token', expiresIn: 1000, role: 'ADMIN' }));
    component.loginObj = { email: 'admin@example.com', password: 'secret' };

    component.onLogar();

    expect(authService.login).toHaveBeenCalledWith({ email: 'admin@example.com', password: 'secret' });
    expect(router.navigate).toHaveBeenCalledWith(['/admin/user']);
  });

  it('routes a USER to their profile', () => {
    authService.login.mockReturnValue(of({ accessToken: 'user-token', expiresIn: 1000, role: 'USER' }));

    component.onLogar();

    expect(router.navigate).toHaveBeenCalledWith(['/perfil']);
  });

  it('marks credentials invalid when login fails', () => {
    authService.login.mockReturnValue(throwError(() => new Error('unauthorized')));

    component.onLogar();

    expect(component.invalid).toBe(true);
  });
});

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.development';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('posts credentials and stores the returned access token and role', () => {
    const credentials = { email: 'admin@example.com', password: 'secret' };
    service.login(credentials).subscribe();

    const request = httpTesting.expectOne(`${environment.apiUrl}/api/v1/auth/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(credentials);
    request.flush({ accessToken: 'admin-token', expiresIn: 1000, role: 'ADMIN' });

    expect(service.getToken()).toBe('admin-token');
    expect(service.getRole()).toBe('ADMIN');
    expect(service.autenticado()).toBe(true);
  });

  it('reads the user ID from the token subject', () => {
    const payload = btoa(JSON.stringify({ sub: 'user-123' }));
    service.setToken(`header.${payload}.signature`);

    expect(service.getUserId()).toBe('user-123');
  });

  it('clears token and role on logout', () => {
    service.login({ email: 'user@example.com', password: 'secret' }).subscribe();
    httpTesting.expectOne(`${environment.apiUrl}/api/v1/auth/login`).flush({
      accessToken: 'user-token', expiresIn: 1000, role: 'USER'
    });

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.getRole()).toBeNull();
    expect(service.autenticado()).toBe(false);
  });
});

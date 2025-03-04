import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);  // ✅ Use `inject()` instead of calling it like a function
  });

  it('should allow access if authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    expect(authGuard.canActivate()).toBeTrue();
  });

  it('should deny access and redirect if not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    expect(authGuard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});

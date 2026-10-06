import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLayout } from './admin-layout';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

describe('AdminLayout', () => {
  let component: AdminLayout;
  let fixture: ComponentFixture<AdminLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLayout],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { getRole: () => 'ADMIN', logout: () => undefined } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

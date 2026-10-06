import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { User } from './user';

describe('User', () => {
  let component: User;
  let fixture: ComponentFixture<User>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [User],
      providers: [
        { provide: HttpClient, useValue: { get: jest.fn(() => of({ content: [], totalPages: 0 })) } },
        { provide: MatDialog, useValue: { open: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(User);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

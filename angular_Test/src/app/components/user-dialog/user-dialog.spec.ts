import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDialog } from './user-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('UserDialog', () => {
  let component: UserDialog;
  let fixture: ComponentFixture<UserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { tipo: 'create' } },
        { provide: MatDialogRef, useValue: { close: () => undefined } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

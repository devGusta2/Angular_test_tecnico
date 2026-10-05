import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDialog } from './user-dialog';
import { NgModel } from '@angular/forms';

describe('UserDialog', () => {
  let component: UserDialog;
  let fixture: ComponentFixture<UserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDialog, NgModel],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

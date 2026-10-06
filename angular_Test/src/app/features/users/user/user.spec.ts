import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AuditDialog } from '../../../components/audit-dialog/audit-dialog';
import { User } from './user';

describe('User', () => {
  let component: User;
  let fixture: ComponentFixture<User>;
  let dialogOpen: jest.Mock;
  let listResponse: any;

  beforeEach(async () => {
    dialogOpen = jest.fn();
    listResponse = { content: [], totalPages: 0 };
    await TestBed.configureTestingModule({
      imports: [User],
      providers: [
        { provide: HttpClient, useValue: { get: jest.fn(() => of(listResponse)) } },
        { provide: MatDialog, useValue: { open: dialogOpen } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(User);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens the audit dialog for the selected user from the table action', () => {
    const user = {
      id: 'user-1', name: 'Ana Souza', email: 'ana@example.com', phone: '11999999999', active: true,
      createdAt: '2026-06-17T08:10:00', createdBy: 'creator-uuid',
      updatedAt: '2026-06-18T09:20:00', updatedBy: 'updater-uuid'
    };
    listResponse = { content: [user], totalPages: 1 };
    fixture.detectChanges();

    const auditButton = fixture.nativeElement.querySelector('button[aria-label="Auditoria"]') as HTMLButtonElement;
    expect(auditButton).toBeTruthy();
    auditButton.click();

    expect(dialogOpen).toHaveBeenCalledWith(AuditDialog, { data: user, width: '480px' });
  });
});

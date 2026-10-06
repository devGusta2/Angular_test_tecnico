import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuditDialog, UserAuditData } from './audit-dialog';

describe('AuditDialog', () => {
  let fixture: ComponentFixture<AuditDialog>;

  function render(data: UserAuditData): HTMLElement {
    TestBed.configureTestingModule({
      imports: [AuditDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: { close: jest.fn() } }
      ]
    });
    fixture = TestBed.createComponent(AuditDialog);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('displays audit fields and formats dates in Brazilian format', () => {
    const page = render({
      createdAt: '2026-06-17T08:10:00',
      createdBy: 'creator-uuid',
      updatedAt: '2026-06-18T09:20:00',
      updatedBy: 'updater-uuid'
    });

    expect(page.textContent).toContain('Auditoria do usuário');
    expect(page.textContent).toContain('Criado em');
    expect(page.textContent).toContain('17/06/2026');
    expect(page.textContent).toContain('Criado por');
    expect(page.textContent).toContain('creator-uuid');
    expect(page.textContent).toContain('Atualizado em');
    expect(page.textContent).toContain('18/06/2026');
    expect(page.textContent).toContain('Atualizado por');
    expect(page.textContent).toContain('updater-uuid');
    expect(page.textContent).toContain('Fechar');
  });

  it('shows a fallback when audit fields are null', () => {
    const page = render({ createdAt: null, createdBy: null, updatedAt: null, updatedBy: null });

    expect(page.textContent?.match(/Não informado/g)).toHaveLength(4);
  });
});

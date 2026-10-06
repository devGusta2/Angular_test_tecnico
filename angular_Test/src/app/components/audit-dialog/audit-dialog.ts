import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface UserAuditData {
  createdAt: string | null;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}

@Component({
  selector: 'app-audit-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './audit-dialog.html',
  styleUrl: './audit-dialog.css'
})
export class AuditDialog {
  readonly data = inject<UserAuditData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AuditDialog>);

  formatDate(value: string | null): string {
    if (!value) return 'Não informado';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Não informado';
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  }

  fechar(): void { this.dialogRef.close(); }
}

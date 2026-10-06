import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface FeedbackDialogData {
  type: 'success' | 'error';
  title: string;
  message: string;
}

@Component({
  selector: 'app-feedback-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './feedback-dialog.html',
  styleUrl: './feedback-dialog.css'
})
export class FeedbackDialog {
  readonly data = inject<FeedbackDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<FeedbackDialog>);

  fechar(): void { this.dialogRef.close(); }
}

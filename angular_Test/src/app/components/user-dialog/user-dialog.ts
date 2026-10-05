import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-user-dialog',
  imports: [MatDialogModule, ReactiveFormsModule],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.css',
})
export class UserDialog {
  dialogRef = inject(MatDialogRef<UserDialog>);
  data = inject(MAT_DIALOG_DATA);
  tipo: 'create' | 'edit' | 'view' | 'delete' = this.data.tipo;

  fb = inject(FormBuilder);

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    phone: ['', Validators.required],

    endereco: this.fb.array<FormGroup>([])
  });



  get endereco() {
    return this.userForm.controls.endereco;
  }

  adicionarEnd() {
    const endereco = this.fb.group({
      cep: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      rua: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],
      cidade: [{ value: '', disabled: true }],
      bairro: [{ value: '', disabled: true }],
      principal: [false]
    });
    this.endereco.push(endereco);
  }

  removerEnd(index: number) {
    this.endereco.removeAt(index);
  }

  salvar() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.userForm.getRawValue());
  }

  fechar() {
    this.dialogRef.close();
  }









  confirmarDeactivate(){
    this.dialogRef.close({
      id: this.data.user.id
    })
  }
}

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

    enderecos: this.fb.array<FormGroup>([])
  });



  get enderecos() {
    return this.userForm.controls.enderecos;
  }

  adicionarEnd() {
    const endereco = this.fb.group({
      cep: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      bairro: ['', Validators.required],
      principal: [false]
    });
    this.enderecos.push(endereco);
  }

  removerEnd(index: number) {
    this.enderecos.removeAt(index);
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
}

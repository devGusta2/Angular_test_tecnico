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
  addressError = '';

  fb = inject(FormBuilder);

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.email],
    password: [''],
    phone: ['', Validators.required],

    endereco: this.fb.array<FormGroup>([])
  });

  private originalAddresses: any[] = [];

  constructor() {
    if (this.tipo === 'create') {
      this.userForm.controls.email.addValidators(Validators.required);
      this.userForm.controls.password.addValidators(Validators.required);
      return;
    }
    const user = this.data?.user;
    if (!user) return;

    this.userForm.patchValue({
      name: user.name ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      password: ''
    });

    this.originalAddresses = (user.enderecos ?? []).map((address: any) => ({
      id: address.id,
      cep: address.cep ?? '',
      numero: address.numero ?? '',
      complemento: address.complemento ?? '',
      principal: !!address.principal,
      rua: address.rua ?? '', estado: address.estado ?? '',
      cidade: address.cidade ?? '', bairro: address.bairro ?? ''
    }));
    this.originalAddresses.forEach(address => this.addAddressForm(address));

    if (this.tipo === 'view') this.userForm.disable();
  }



  get endereco() {
    return this.userForm.controls.endereco;
  }

  adicionarEnd() {
    this.addAddressForm({});
  }

  private addAddressForm(value: any) {
    const endereco = this.fb.group({
      id: [value.id ?? null],
      cep: [value.cep ?? '', Validators.required],
      numero: [value.numero ?? '', Validators.required],
      complemento: [value.complemento ?? ''],
      rua: [{ value: value.rua ?? '', disabled: true }],
      estado: [{ value: value.estado ?? '', disabled: true }],
      cidade: [{ value: value.cidade ?? '', disabled: true }],
      bairro: [{ value: value.bairro ?? '', disabled: true }],
      principal: [!!value.principal]
    });
    this.endereco.push(endereco);
  }

  removerEnd(index: number) {
    if (this.endereco.at(index).get('id')?.value) return;
    this.endereco.removeAt(index);
  }

  salvar() {
    this.addressError = '';
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const addresses = this.userForm.getRawValue().endereco;
    if (addresses.filter(address => address['principal']).length > 1) {
      this.addressError = 'Selecione no máximo um endereço principal.';
      return;
    }

    if (this.tipo === 'edit') {
      const { name, email, phone, password } = this.userForm.getRawValue();
      const payload: any = { name, phone };
      if (email?.trim()) payload.email = email.trim();
      if (password?.trim()) payload.password = password;
      const current = addresses.map(({ id, cep, numero, complemento, principal }) => ({
        id: id || null, cep, numero, complemento, principal
      }));
      const original = this.originalAddresses.map(({ id, cep, numero, complemento, principal }) => ({
        id: id || null, cep, numero, complemento, principal
      }));
      if (JSON.stringify(current) !== JSON.stringify(original)) payload.endereco = current;
      this.dialogRef.close(payload);
      return;
    }

    const { endereco, ...user } = this.userForm.getRawValue();
    this.dialogRef.close({
      ...user,
      endereco: endereco.map(({ id, ...address }) => address)
    });
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

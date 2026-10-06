import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { UserDialog } from '../../../components/user-dialog/user-dialog';


@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {
  ngOnInit(): void {
    this.listUsers();
  }

  http = inject(HttpClient)
  dialog = inject(MatDialog);
  private apiUrl = environment.apiUrl;
  userList: any[] = [];
  cdr = inject(ChangeDetectorRef);
  listUsers() {
    this.http.get(`${environment.apiUrl}/api/v1/users/list`).subscribe((Res: any) => {
      console.log(Res);
      this.userList = Res;
      this.cdr.detectChanges();
    })

  }


  openDialog(tipo: 'create' | 'edit' | 'view' | 'delete', user?: any) {

    const dialogRef = this.dialog.open(UserDialog, {
      data: {
        tipo: tipo,
        user: user
      }
    });
dialogRef.afterClosed().subscribe(payload => {

  console.log('Payload recebido:', payload);

  if (!payload) {
    return;
  }

  if (tipo === 'create') {
    this.criarUsuario(payload);
  }

  if (tipo === 'edit' && user?.id) {
    this.atualizarUsuario(user.id, payload);
  }

  if (tipo === 'delete') {
    this.desativarUsario(payload.id);
  }
});

  }

  atualizarUsuario(id: string, payload: any) {
    this.http.patch<any>(`${this.apiUrl}/api/v1/users/${id}`, payload).subscribe({
      next: (updatedUser) => {
        this.userList = this.userList.map(user => user.id === updatedUser.id ? updatedUser : user);
        this.cdr.detectChanges();
        window.alert('Usuário atualizado com sucesso.');
      },
      error: (err) => {
        const messages: Record<number, string> = {
          400: 'Os dados informados são inválidos. Verifique os campos e os endereços principais.',
          404: 'Usuário ou endereço não encontrado.',
          409: 'Este e-mail já está cadastrado.'
        };
        window.alert(messages[err.status] ?? err.error?.message ?? 'Não foi possível atualizar o usuário.');
      }
    });
  }


  criarUsuario(payload: any) {
    // console.log('Enviando para API:', JSON.stringify(payload, null, 2));


    this.http.post(`${environment.apiUrl}/api/v1/users/create`, payload).subscribe({
      next: () => {
        this.listUsers();
      },
      error: (err) => {
        console.log(err)
      }
    });

  }


  desativarUsario(id: any){
    this.http.patch(`${environment.apiUrl}/api/v1/users/${id}/deactivate`,null).subscribe({
      next: ()=>{
        this.listUsers();
      },
      error: () =>{
        console.log("Erro ao desativar usuario");
      }
    })
  }


}

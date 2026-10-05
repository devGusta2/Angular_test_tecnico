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

    console.log(payload);

    if (!payload) {
      return;
    }

    if (tipo === 'create') {
      this.criarUsuario(payload);
    }

  });
}


criarUsuario(payload: any) {
  console.log('Enviando para API:', payload);

  // this.http.post(
  //   `${environment.apiUrl}/users/create`,
  //   payload
  // ).subscribe({
  //   next: () => {
  //     this.listUsers();
  //   },
  //   error: (err) => {
  //     console.error(err);
  //   }
  // });
}


}

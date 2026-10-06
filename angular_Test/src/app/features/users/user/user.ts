import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment.development';
import { UserDialog } from '../../../components/user-dialog/user-dialog';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly apiUrl = environment.apiUrl;

  userList: any[] = [];
  nameFilter = '';
  emailFilter = '';
  page = 0;
  readonly size = 10;
  totalPages = 0;

  ngOnInit(): void { this.listUsers(); }

  listUsers(): void {
    let params = new HttpParams()
      .set('page', this.page)
      .set('size', this.size)
      .set('sort', 'name,asc');
    if (this.nameFilter.trim()) params = params.set('name', this.nameFilter.trim());
    if (this.emailFilter.trim()) params = params.set('email', this.emailFilter.trim());

    this.http.get<any>(`${this.apiUrl}/api/v1/users/list`, { params }).subscribe({
      next: (response) => {
        this.userList = response.content ?? [];
        this.totalPages = response.totalPages ?? 0;
        this.cdr.detectChanges();
      },
      error: (err) => window.alert(this.errorMessage(err, 'Não foi possível carregar os usuários.'))
    });
  }

  filtrar(): void { this.page = 0; this.listUsers(); }

  mudarPagina(offset: number): void {
    const nextPage = this.page + offset;
    if (nextPage >= 0 && nextPage < this.totalPages) {
      this.page = nextPage;
      this.listUsers();
    }
  }

  private errorMessage(err: any, fallback: string): string {
    const messages: Record<number, string> = {
      400: 'Os dados informados são inválidos. Verifique os campos e o CEP.',
      401: 'Sua sessão expirou. Faça login novamente.',
      403: 'Você não tem permissão para esta operação.',
      404: 'Usuário ou endereço não encontrado.',
      409: 'Este e-mail já está cadastrado.',
      422: 'A operação viola uma regra de negócio, como selecionar mais de um endereço principal.'
    };
    return err.error?.detail ?? messages[err.status] ?? fallback;
  }

  openDialog(tipo: 'create' | 'edit' | 'view' | 'delete', user?: any): void {
    this.dialog.open(UserDialog, { data: { tipo, user } }).afterClosed().subscribe(payload => {
      if (!payload) return;
      if (tipo === 'create') this.criarUsuario(payload);
      if (tipo === 'edit' && user?.id) this.atualizarUsuario(user.id, payload);
      if (tipo === 'delete') this.desativarUsuario(payload.id);
    });
  }

  atualizarUsuario(id: string, payload: any): void {
    this.http.patch<any>(`${this.apiUrl}/api/v1/users/${id}`, payload).subscribe({
      next: () => this.listUsers(),
      error: (err) => window.alert(this.errorMessage(err, 'Não foi possível atualizar o usuário.'))
    });
  }

  criarUsuario(payload: any): void {
    this.http.post(`${this.apiUrl}/api/v1/users/create`, payload).subscribe({
      next: () => this.listUsers(),
      error: (err) => window.alert(this.errorMessage(err, 'Não foi possível criar o usuário.'))
    });
  }

  desativarUsuario(id: string): void {
    this.http.patch(`${this.apiUrl}/api/v1/users/${id}/deactivate`, null).subscribe({
      next: () => this.listUsers(),
      error: (err) => window.alert(this.errorMessage(err, 'Não foi possível desativar o usuário.'))
    });
  }
}

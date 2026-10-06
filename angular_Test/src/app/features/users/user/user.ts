import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment.development';
import { UserDialog } from '../../../components/user-dialog/user-dialog';
import { FeedbackDialog, FeedbackDialogData } from '../../../components/feedback-dialog/feedback-dialog';
import { AuditDialog } from '../../../components/audit-dialog/audit-dialog';

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
    let params = new HttpParams().set('page', this.page).set('size', this.size).set('sort', 'name,asc');
    if (this.nameFilter.trim()) params = params.set('name', this.nameFilter.trim());
    if (this.emailFilter.trim()) params = params.set('email', this.emailFilter.trim());
    this.http.get<any>(`${this.apiUrl}/api/v1/users/list`, { params }).subscribe({
      next: (response) => {
        this.userList = response.content ?? [];
        this.totalPages = response.totalPages ?? 0;
        this.cdr.detectChanges();
      },
      error: (err) => this.showError(err, 'Nao foi possivel carregar os usuarios.')
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
      400: 'Dados invalidos. Confira os campos e o CEP.',
      401: 'Sua sessao expirou. Faca login novamente.',
      403: 'Sua conta nao tem permissao para esta operacao.',
      404: 'Usuario ou endereco nao encontrado.',
      409: 'Este e-mail ja esta cadastrado.',
      422: 'A operacao viola uma regra de negocio. Confira os enderecos principais.'
    };
    return err.error?.detail ?? err.error?.message ?? messages[err.status] ?? fallback;
  }

  private showFeedback(data: FeedbackDialogData): void {
    this.dialog.open(FeedbackDialog, { data, width: '400px' });
  }

  private showError(err: any, fallback: string): void {
    this.showFeedback({
      type: 'error',
      title: 'Nao foi possivel concluir a operacao',
      message: this.errorMessage(err, fallback)
    });
  }

  openDialog(tipo: 'create' | 'edit' | 'view' | 'delete', user?: any): void {
    this.dialog.open(UserDialog, { data: { tipo, user } }).afterClosed().subscribe(payload => {
      if (!payload) return;
      if (tipo === 'create') this.criarUsuario(payload);
      if (tipo === 'edit' && user?.id) this.atualizarUsuario(user.id, payload);
      if (tipo === 'delete') this.desativarUsuario(payload.id);
    });
  }

  openAuditDialog(user: any): void {
    this.dialog.open(AuditDialog, { data: user, width: '480px' });
  }

  atualizarUsuario(id: string, payload: any): void {
    this.http.patch<any>(`${this.apiUrl}/api/v1/users/${id}`, payload).subscribe({
      next: () => {
        this.showFeedback({ type: 'success', title: 'Usuario atualizado', message: 'As alteracoes foram salvas com sucesso.' });
        this.listUsers();
      },
      error: (err) => this.showError(err, 'Nao foi possivel atualizar o usuario.')
    });
  }

  criarUsuario(payload: any): void {
    this.http.post(`${this.apiUrl}/api/v1/users/create`, payload).subscribe({
      next: () => {
        this.showFeedback({ type: 'success', title: 'Usuario cadastrado', message: 'O novo usuario foi cadastrado com sucesso.' });
        this.listUsers();
      },
      error: (err) => this.showError(err, 'Nao foi possivel cadastrar o usuario.')
    });
  }

  desativarUsuario(id: string): void {
    this.http.patch(`${this.apiUrl}/api/v1/users/${id}/deactivate`, null).subscribe({
      next: () => {
        this.showFeedback({ type: 'success', title: 'Usuario desativado', message: 'O usuario foi desativado com sucesso.' });
        this.listUsers();
      },
      error: (err) => this.showError(err, 'Nao foi possivel desativar o usuario.')
    });
  }
}

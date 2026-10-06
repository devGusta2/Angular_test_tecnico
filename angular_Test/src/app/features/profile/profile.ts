import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment.development';
import { UserDialog } from '../../components/user-dialog/user-dialog';
import { FeedbackDialog, FeedbackDialogData } from '../../components/feedback-dialog/feedback-dialog';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly dialog = inject(MatDialog);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = environment.apiUrl;
  user: any;

  ngOnInit(): void { this.loadProfile(); }

  private loadProfile(): void {
    const id = this.auth.getUserId();
    if (!id) {
      this.showFeedback({ type: 'error', title: 'Sessao invalida', message: 'Faca login novamente para acessar seu perfil.' });
      return;
    }
    this.http.get<any>(`${this.apiUrl}/api/v1/users/${id}`).subscribe({
      next: user => this.user = user,
      error: err => this.showError(err, 'Nao foi possivel carregar seu perfil.')
    });
  }

  editarPerfil(): void {
    this.dialog.open(UserDialog, { data: { tipo: 'edit', user: this.user } })
      .afterClosed().subscribe(payload => {
        if (!payload || !this.user?.id) return;
        this.http.patch<any>(`${this.apiUrl}/api/v1/users/${this.user.id}`, payload).subscribe({
          next: user => {
            this.user = user;
            this.showFeedback({ type: 'success', title: 'Perfil atualizado', message: 'Suas alteracoes foram salvas com sucesso.' });
          },
          error: err => this.showError(err, 'Nao foi possivel atualizar seu perfil.')
        });
      });
  }

  removerEndereco(address: any): void {
    if (!window.confirm(`Remover o endereco ${address.cep}?`)) return;
    this.http.delete(`${this.apiUrl}/api/v1/endereco/${address.id}`).subscribe({
      next: () => {
        this.showFeedback({ type: 'success', title: 'Endereco removido', message: 'O endereco foi removido do seu perfil.' });
        this.loadProfile();
      },
      error: err => this.showError(err, 'Nao foi possivel remover o endereco.')
    });
  }

  private showFeedback(data: FeedbackDialogData): void {
    this.dialog.open(FeedbackDialog, { data, width: '400px' });
  }

  private showError(err: any, fallback: string): void {
    const messages: Record<number, string> = {
      400: 'Dados invalidos. Confira os campos e o CEP.',
      401: 'Sua sessao expirou. Faca login novamente.',
      403: 'Voce nao tem permissao para acessar este perfil.',
      404: 'Perfil nao encontrado.',
      409: 'Este e-mail ja esta cadastrado.',
      422: 'A operacao viola uma regra de negocio. Confira os enderecos principais.'
    };
    this.showFeedback({
      type: 'error',
      title: 'Nao foi possivel concluir a operacao',
      message: err.error?.detail ?? err.error?.message ?? messages[err.status] ?? fallback
    });
  }
}

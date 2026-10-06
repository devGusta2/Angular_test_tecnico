import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  get isAdmin(): boolean { return this.auth.getRole() === 'ADMIN'; }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}

import { HttpClient } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/services/LoginRequest';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})


export class Login {

  private authServices = inject(AuthService)
  private readonly router = inject(Router);
  invalid = false;
  loginObj: LoginRequest = {
    email: '',
    password: ''
  }

  onDigitando(){
    this.invalid = false;
  }

  onLogar() :void {
    this.authServices.login(this.loginObj).subscribe({
      next: (response: any) =>{
        this.router.navigate(['/admin'])
      },
      error: (error: any) =>{
        this.invalid = true;
        console.log("Erro ao fazer login", error)
      }
    })
  }

}

import { HttpClient } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/services/LoginRequest';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})


export class Login {

  private authServices = inject(AuthService)

  loginObj: LoginRequest = {
    email: '',
    password: ''
  }


  onLogar() :void {
    this.authServices.login(this.loginObj).subscribe({
      next: (response: any) =>{
        console.log(response)
      },
      error: (error: any) =>{
        console.log("Erro ao fazer login", error)
      }
    })
  }

}

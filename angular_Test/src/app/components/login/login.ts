import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})


export class Login {

  url = environment.apiUrl;

  loginObj: any = {
    "email": "",
    "password": ""
  }

  http = inject(HttpClient);

  onLogar(){
    this.http.post();
  }
}

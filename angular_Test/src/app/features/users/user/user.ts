import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit{
  ngOnInit(): void {
    this.listUsers();
  }

  http = inject(HttpClient)

  userList: any[] = [];
  cdr = inject(ChangeDetectorRef);
  listUsers(){
    this.http.get(`${environment.apiUrl}/users/list`).subscribe((Res: any) =>{
      console.log(Res);
      this.userList = Res;
      this.cdr.detectChanges();
    })
    
  }
}

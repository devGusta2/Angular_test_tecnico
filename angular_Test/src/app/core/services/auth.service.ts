import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { LoginRequest } from "./LoginRequest";
import { Observable } from "rxjs";
import { LoginResponse } from "./LoginResponse";





@Injectable({
    providedIn: 'root' 
})
export class AuthService {
    private http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    login(data: LoginRequest): Observable<LoginResponse>{
        return this.http.post<LoginResponse> (
            `${this.apiUrl}/auth/login`,
            data
        )
    }
}
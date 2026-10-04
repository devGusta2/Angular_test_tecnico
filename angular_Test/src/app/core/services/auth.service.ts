import { HttpClient } from "@angular/common/http";
import { Inject, inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { LoginRequest } from "./LoginRequest";
import { Observable, tap } from "rxjs";
import { LoginResponse } from "./LoginResponse";


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;
    private token: string | null = null;

    setToken(token: string): void {
        this.token = token;
    }
    getToken(): string | null {
        return this.token;
    }

    autenticado(): boolean {
        return this.token !== null;
    }

    logout(): void {
        this.token = null;
    }

    login(data: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(
            `${this.apiUrl}/auth/login`,
            data
        ).pipe(tap(response =>{
                this.setToken(response.accessToken)
            })
        )
    }
}
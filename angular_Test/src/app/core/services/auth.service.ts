import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
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
    private role: 'ADMIN' | 'USER' | null = null;

    setToken(token: string): void {
        this.token = token;
    }
    getToken(): string | null {
        return this.token;
    }

    getRole(): 'ADMIN' | 'USER' | null { return this.role; }

    getUserId(): string | null {
        if (!this.token) return null;
        try {
            const payload = JSON.parse(atob(this.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            return payload.sub ?? null;
        } catch {
            return null;
        }
    }

    autenticado(): boolean {
        return this.token !== null;
    }

    logout(): void {
        this.token = null;
        this.role = null;
    }

    login(data: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(
            `${this.apiUrl}/api/v1/auth/login`,
            data
        ).pipe(tap(response =>{
                this.setToken(response.accessToken);
                this.role = response.role;
            })
        )
    }
}

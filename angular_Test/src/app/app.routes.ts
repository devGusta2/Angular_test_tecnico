import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { User } from './features/users/user/user';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { autorizadoGuard } from './guard/autorizado-guard';

export const routes: Routes = [
    {
        path: "login",
        component: Login
    },
    {
        path: "admin",
        component: AdminLayout,
        canActivate: [autorizadoGuard],
        children:[
            {
                path:"user",
                component: User
            }
        ]
    },
       {
        path: "**",
        redirectTo: 'login'
        
    }
];

import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { User } from './features/users/user/user';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { autorizadoGuard } from './guard/autorizado-guard';
import { Profile } from './features/profile/profile';

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
                component: User,
                canActivate: [autorizadoGuard],
                data: { roles: ['ADMIN'] }
            }
        ]
    },
    {
        path: 'perfil',
        component: AdminLayout,
        canActivate: [autorizadoGuard],
        data: { roles: ['USER'] },
        children: [{ path: '', component: Profile }]
    },
       {
        path: "**",
        redirectTo: 'login'
        
    }
];

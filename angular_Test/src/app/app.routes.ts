import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { User } from './features/users/user/user';
import { AdminLayout } from './layout/admin-layout/admin-layout';

export const routes: Routes = [
    {
        path: "",
        component: Login
    },
    {
        path: "admin",
        component: AdminLayout,
        children:[
            {
                path:"user",
                component: User
            }
        ]
    }
];

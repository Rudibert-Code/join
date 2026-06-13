import { Routes } from '@angular/router';
import { ContactList } from './pages/contact-list/contact-list';
import { Dummy } from './pages/dummy/dummy'
import { LogIn } from './components/log-in/log-in';

export const routes: Routes = [
    {
        path:'',
        component:Dummy
    },
    {
        path:'contact-list',
        component:ContactList
    },
    {
        path:"login",
        component:LogIn
    }
];

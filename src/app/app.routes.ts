import { Routes } from '@angular/router';
import { ContactList } from './pages/contact-list/contact-list';
import { Dummy } from './pages/dummy/dummy'

export const routes: Routes = [
    {
        path:'',
        component:Dummy
    },
    {
        path:'contact-list',
        component:ContactList
    },
];

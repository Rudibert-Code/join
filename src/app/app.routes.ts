import { Routes } from '@angular/router';
import { ContactList } from './pages/contact-list/contact-list';
import { Dummy } from './pages/dummy/dummy'
import { LogIn } from './pages/log-in/log-in';
import { LegalNotice } from './pages/legal-notice/legal-notice';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';

export const routes: Routes = [
    {
        path:'',
        component: Dummy
        //redirectTo: 'login',
        //pathMatch: 'full'
    },
    {
        path:'contact-list',
        component:ContactList
    },
    {
        path:"login",
        component:LogIn
    },
        {
        path:'login/legal',
        component:LegalNotice
    },
    {
        path:"login/policy",
        component:PrivacyPolicy
    }
];

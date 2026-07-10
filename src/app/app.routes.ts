import { Routes } from '@angular/router';
import { ContactList } from './pages/contact-list/contact-list';
import { AddTask } from './pages/add-task/add-task';
import { Board } from './pages/board/board';
import { MainLayout } from './layouts/main-layout/main-layout';
import { LogIn } from './pages/log-in/log-in';
import { LegalNotice } from './pages/legal-notice/legal-notice';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { Summary } from './pages/summary/summary';
import { Signup } from './pages/signup/signup';
import { Help } from './pages/help/help';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LogIn },
  { path: 'signup', component: Signup },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'summary', component: Summary },
      { path: 'add-task', component: AddTask },
      { path: 'board', component: Board },
      { path: 'contact-list', component: ContactList },
      { path: 'help', component: Help },
      { path: 'legal-notice', component: LegalNotice },
      { path: 'privacy-police', component: PrivacyPolicy },
    ],
  },
];

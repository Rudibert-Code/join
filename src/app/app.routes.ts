import { Routes } from '@angular/router';
import { ContactList } from './pages/contact-list/contact-list';
import { Summery } from './pages/summery/summery';
import { AddTask } from './pages/add-task/add-task';
import { Board } from './pages/board/board';
import { MainLayout } from './layouts/main-layout/main-layout';
import { LogIn } from './pages/log-in/log-in';
import { LegalNotice } from './pages/legal-notice/legal-notice';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';

export const routes: Routes = [
  {
    path: 'login',
    component: LogIn,
  },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'summery', pathMatch: 'full' },
      { path: 'summery', component: Summery },
      { path: 'add-task', component: AddTask },
      { path: 'board', component: Board },
      { path: 'contact-list', component: ContactList },
      { path: 'legal-notice', component: LegalNotice },
      { path: 'privacy-police', component: PrivacyPolicy },
    ],
  },
];

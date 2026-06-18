import { Routes } from '@angular/router';
import { ContactList } from './pages/contact-list/contact-list';
import { ContactLinksMobileDetails } from './pages/contact-links-mobile-details/contact-links-mobile-details';
import { AddTask } from './pages/add-task/add-task';
import { Board } from './pages/board/board';
import { MainLayout } from './layouts/main-layout/main-layout';
import { LogIn } from './pages/log-in/log-in';
import { LegalNotice } from './pages/legal-notice/legal-notice';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { Summary } from './pages/summary/summary';

export const routes: Routes = [
  {
    path: 'login',
    component: LogIn,
  },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'summary', pathMatch: 'full' },
      { path: 'summary', component: Summary },
      { path: 'add-task', component: AddTask },
      { path: 'board', component: Board },
      { path: 'contact-list', component: ContactList },
      { path: 'contact-list-mobile-details', component: ContactLinksMobileDetails },
      { path: 'legal-notice', component: LegalNotice },
      { path: 'privacy-police', component: PrivacyPolicy },
    ],
  },
];

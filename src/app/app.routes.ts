import { Routes } from '@angular/router';
import { ContactList } from './pages/contact-list/contact-list';
import { Dummy } from './pages/dummy/dummy';
import { LogIn } from './components/log-in/log-in';
import { Summery } from './pages/summery/summery';
import { AddTask } from './pages/add-task/add-task';
import { Board } from './pages/board/board';
import { MainLayout } from './layouts/main-layout/main-layout';

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
    ],
  },
];

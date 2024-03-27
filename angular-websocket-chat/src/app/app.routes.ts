import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';

export const APP_ROUTES: Routes = [
  { path: 'chat/:userId', component: ChatComponent, }
];

import { Component, OnInit, inject } from '@angular/core';

import { ChatMessage } from './../../models/chat-message.model';
import { ChatService } from './../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {

  private _chatService = inject(ChatService);

  ngOnInit(): void {
    this._chatService.joinRoom('estudiantes');
  }

  public sendMessage() {
    const message: ChatMessage = { message: 'Buenos días', user: 'magadiflo' };
    this._chatService.sendMessage('estudiantes', message);
  }

}

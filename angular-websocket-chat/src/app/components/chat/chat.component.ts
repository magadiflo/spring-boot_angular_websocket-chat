import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

import { ChatMessage } from './../../models/chat-message.model';
import { ChatService } from './../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {

  private _chatService = inject(ChatService);
  private _activatedRoute = inject(ActivatedRoute);

  public messageInput: FormControl = new FormControl('', { nonNullable: true });
  public userId?: string;
  public messageList: ChatMessage[] = [];

  ngOnInit(): void {
    this._activatedRoute.params
      .subscribe(({ userId }) => this.userId = userId);
    this._chatService.joinRoom('estudiantes');
    this.listenerMessage();
  }

  public sendMessage(): void {
    const message: ChatMessage = {
      message: this.messageInput.value,
      user: this.userId!,
    };
    this._chatService.sendMessage('estudiantes', message);
    this.messageInput.reset();
  }

  private listenerMessage(): void {
    this._chatService.messageSubject
      .subscribe((messages: any) => {
        console.log(messages);

        this.messageList = messages.map((item: any) => ({ ...item, message_side: item.user === this.userId ? 'sent' : 'received' }));
      });
  }

}

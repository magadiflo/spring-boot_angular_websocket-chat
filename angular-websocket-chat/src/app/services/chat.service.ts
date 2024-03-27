import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { ChatMessage } from '../models/chat-message.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;
  private messageSubject$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

  constructor() {
    this.initConnectionSocket();
  }

  public get messageSubject(): Observable<ChatMessage[]> {
    return this.messageSubject$.asObservable();
  }

  public initConnectionSocket(): void {
    const url = '//localhost:3000/chat-socket'; //* Conexión TCP, no es conexión HTTP
    const socket = new SockJS(url);

    this.stompClient = Stomp.over(socket); //* Instanciando la conexión para el Socket
  }

  //* Conexión al room
  public joinRoom(roomId: string): void {
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
        const messageContent = JSON.parse(messages.body);
        //* console.log(messageContent); //* Ejemplo: {message: 'Hola brother', user: 'magadiflo'}
        const currentMessage: ChatMessage[] = this.messageSubject$.getValue();
        currentMessage.push(messageContent);

        this.messageSubject$.next(currentMessage);
      });
    });
  }

  //* /app, se obtiene por que en la línea 36 de la clase WebSocketConfiguration del backend fue definida
  public sendMessage(roomId: string, chatMessage: ChatMessage): void {
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
  }
}

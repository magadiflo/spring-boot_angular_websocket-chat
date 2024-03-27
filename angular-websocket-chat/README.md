# AngularWebsocketChat

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.3.

---

## Dependencias

- [@stomp/stompjs](https://www.npmjs.com/package/@stomp/stompjs)
- [sockjs-client](https://www.npmjs.com/package/sockjs-client)

Ambas dependencias nos permitirán hacer la conexión con nuestro servidor.

La siguiente dependencia nos permitirá tipar la librería `sockjs` para poder trabajarlo en Angular:

- [@types/sockjs-client](https://www.npmjs.com/package/@types/sockjs-client)



## Clase de servicio

````typescript
import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;

  constructor() {
    this.initConnectionSocket();
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
        console.log(messageContent);
      });
    });
  }

  //* /app, se obtiene por que en la línea 36 de la clase WebSocketConfiguration del backend fue definida
  public sendMessage(roomId: string, chatMessage: ChatMessage): void {
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
  }
}
````

````typescript
export interface ChatMessage {
  message: string;
  user: string;
}
````

## Solucionando mensaje de error

El siguiente error es por que, la librería `@stomp/stompjs` está diseñada para el servidor y nosotros lo estamos consumiendo desde un cliente de `Angular`. 

```bash
Uncaught ReferenceError: global is not defined
    at node_modules/sockjs-client/lib/utils/browser-crypto.js 
```

Para solucionar el error, debemos decirle a Angular que tome la configuración como un servidor.

## Solucionando el error "Uncaught ReferenceError: global is not defined"

Necesitamos indicarle a la librería de Stomp que estamos consumiendo la librería desde un cliente.

Para eso, en el archivo `index.html` agregamos el siguiente script:
```typescript
<script>
  //* Con esto le indicamos que la librería lo estamos consumiendo desde un cliente
  var global = global || window;
</script>
```

## Componente de chat

```html
<div class="container mt-5">
  <div class="chat-container p-3 bg-color">
    <ul class="chat-box" id="chat-box">
      <li class="message received">Hola, ¿cómo estás?</li>
      <li class="message sent">¡Hola! Estoy bien, ¿y tú?</li>
      <li class="message received">Yo también estoy bien, gracias por preguntar.</li>
      <li class="message sent">¿Tienes algún plan para hoy?</li>
      <li class="message received">No aún, estoy pensando qué hacer.</li>
      <li class="message sent">Podríamos salir a caminar si el clima es agradable.</li>
      <li class="message received">¡Eso suena bien!</li>
    </ul>
    <div class="input-group pt-3">
      <input type="text" id="message-input" class="form-control message-input" placeholder="Escribe tu mensaje aquí">
      <button type="button" (click)="sendMessage()" class="btn btn-primary">Enviar</button>
    </div>
  </div>
</div>
```

```typescript
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
```

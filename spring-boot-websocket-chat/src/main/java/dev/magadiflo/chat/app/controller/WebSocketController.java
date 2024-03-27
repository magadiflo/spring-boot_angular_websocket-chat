package dev.magadiflo.chat.app.controller;

import dev.magadiflo.chat.app.dto.ChatMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    /**
     * @DestinationVariable, anotación que indica que un parámetro de método debe estar
     * vinculado a una variable de plantilla en una cadena de plantilla de destino.
     * Compatible con métodos de manejo de mensajes como @MessageMapping.
     * <p>
     * Siempre se requiere una variable de plantilla @DestinationVariable.
     */
    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/{roomId}") // A dónde vamos a redireccionar
    public ChatMessage chat(@DestinationVariable String roomId, ChatMessage message) {
        return message;
    }
}

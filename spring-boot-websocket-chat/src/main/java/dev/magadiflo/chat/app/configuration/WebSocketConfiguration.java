package dev.magadiflo.chat.app.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * @EnableWebSocketManagerBroker, permitirá configurar un broker para la comunicación con los clientes.
 * Agregue esta anotación a una clase @Configuration para habilitar la mensajería respaldada por un agente a través de
 * WebSocket utilizando un subprotocolo de mensajería de nivel superior.
 * <p>
 * Personalice la configuración importada implementando la interfaz WebSocketMessageBrokerConfigurer:
 */

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // El frontEnd con qué path va a conectarse a mi servidor socket
        registry.addEndpoint("/chat-socket")
                .setAllowedOrigins("http://localhost:4200") // Qué clientes pueden conectarse a este endpoint
                .withSockJS(); // Librería a usar en el frontend
    }

    /**
     * Nos permite habilitar un broker, que será el que nos permita la comunicación
     * entre los clientes y el servidor
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");// Mediante qué path van a ingresar a este broker
        registry.setApplicationDestinationPrefixes("/app"); // Path de destino de mensajes, por dónde la aplicación va a estar destinando los mensajes
    }
}

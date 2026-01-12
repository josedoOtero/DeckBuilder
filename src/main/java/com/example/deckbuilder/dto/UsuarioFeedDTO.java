package com.example.deckbuilder.dto;

import com.example.deckbuilder.domain.Mensaje;
import com.example.deckbuilder.domain.Notificacion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioFeedDTO {
    private List<Mensaje> mensajes;
    private List<Notificacion> notificaciones;
}


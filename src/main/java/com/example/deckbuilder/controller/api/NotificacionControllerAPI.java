package com.example.deckbuilder.controller.api;

import com.example.deckbuilder.domain.Mensaje;
import com.example.deckbuilder.domain.Notificacion;
import com.example.deckbuilder.dto.UsuarioFeedDTO;
import com.example.deckbuilder.service.MensajeService;
import com.example.deckbuilder.service.NotificacionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/NotificacionAPI")
public class NotificacionControllerAPI {

    private final NotificacionService notificacionService;
    private final MensajeService mensajeService;

    public NotificacionControllerAPI(NotificacionService notificacionService, MensajeService mensajeService) {
        this.notificacionService = notificacionService;
        this.mensajeService = mensajeService;
    }

    @GetMapping("/mensajes")
    public ResponseEntity<List<Mensaje>> listarMensajes() {
        List<Mensaje> mensajes = mensajeService.findAll();
        return ResponseEntity.ok(mensajes);
    }

    @GetMapping("/mensajes/usuario/{usuarioId}")
    public ResponseEntity<List<Mensaje>> mensajesPorUsuario(@PathVariable Long usuarioId) {
        List<Mensaje> mensajes = mensajeService.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(mensajes);
    }

    @GetMapping("/notificaciones")
    public ResponseEntity<List<Notificacion>> listarNotificaciones() {
        List<Notificacion> notificaciones = notificacionService.findAll();
        return ResponseEntity.ok(notificaciones);
    }

    @GetMapping("/todos/{usuarioId}")
    public ResponseEntity<List<Object>> listarMensajesYNotificaciones(@PathVariable Long usuarioId) {
        List<Mensaje> mensajes = mensajeService.findByUsuarioId(usuarioId);
        List<Notificacion> notificaciones = notificacionService.findAll();

        // Agregamos tipo a cada objeto dinámicamente
        List<Object> combinados = new java.util.ArrayList<>();

        mensajes.forEach(m -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", m.getId());
            map.put("titulo", m.getTitulo());
            map.put("categoria", m.getCategoria());
            map.put("mensaje", m.getMensaje());
            map.put("creadoEn", m.getCreadoEn());
            map.put("tipo", "mensaje");
            combinados.add(map);
        });

        notificaciones.forEach(n -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", n.getId());
            map.put("titulo", n.getTitulo());
            map.put("categoria", n.getCategoria());
            map.put("mensaje", n.getMensaje());
            map.put("creadoEn", n.getCreadoEn());
            map.put("tipo", "notificacion");
            combinados.add(map);
        });

        return ResponseEntity.ok(combinados);
    }

    @PostMapping("/mensajes")
    public ResponseEntity<?> crearMensaje(@RequestBody Mensaje mensaje) {
        try {
            Mensaje creado = mensajeService.crearMensaje(mensaje);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error al crear mensaje", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/notificaciones")
    public ResponseEntity<?> crearNotificacion(@RequestBody Notificacion notificacion) {
        try {
            Notificacion creado = notificacionService.crearNotificacion(notificacion);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error al crear notificación", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
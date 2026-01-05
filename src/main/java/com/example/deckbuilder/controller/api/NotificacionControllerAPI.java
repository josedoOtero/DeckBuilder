package com.example.deckbuilder.controller.api;

import com.example.deckbuilder.domain.Notificacion;
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

    public NotificacionControllerAPI(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @GetMapping({"", "/"})
    public ResponseEntity<List<Notificacion>> all() {
        List<Notificacion> lista = notificacionService.findAll();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> one(@PathVariable Long id) {
        Notificacion notificacion = notificacionService.buscarNotificacionPorId(id);
        if (notificacion == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notificación no encontrada");
        }
        return ResponseEntity.ok(notificacion);
    }

    @PostMapping({"", "/"})
    public ResponseEntity<?> createNotificacion(@RequestBody Notificacion notificacion) {
        try {
            Notificacion creado = notificacionService.crearNotificacion(notificacion);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotificacion(@PathVariable Long id, @RequestBody Notificacion notificacion) {
        try {
            Notificacion existente = notificacionService.buscarNotificacionPorId(id);
            if (existente == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notificación no encontrada");
            }

            existente.setTitulo(notificacion.getTitulo());
            existente.setCategoria(notificacion.getCategoria());
            existente.setMensaje(notificacion.getMensaje());
            existente.setCreadoEn(notificacion.getCreadoEn());

            Notificacion actualizado = notificacionService.actualizarNotificacion(existente);
            return ResponseEntity.ok(actualizado);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotificacion(@PathVariable Long id) {
        try {
            Notificacion existente = notificacionService.buscarNotificacionPorId(id);
            if (existente == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notificación no encontrada");
            }
            notificacionService.eliminarNotificacion(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
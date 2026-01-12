package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.Notificacion;
import com.example.deckbuilder.repository.NotificacionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;

    public NotificacionService(NotificacionRepository notificacionRepository) {
        this.notificacionRepository = notificacionRepository;
    }

    public List<Notificacion> findAll() {
        return notificacionRepository.findAll();
    }

    public Notificacion buscarNotificacionPorId(Long id) {
        return notificacionRepository.findById(id).orElse(null);
    }

    public Notificacion crearNotificacion(Notificacion notificacion) {
        return notificacionRepository.save(notificacion);
    }
}
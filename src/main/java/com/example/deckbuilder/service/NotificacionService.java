package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.Notificacion;
import com.example.deckbuilder.repository.NotificacionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificacionService {
    private final NotificacionRepository notificacionRepository;

    public NotificacionService(NotificacionRepository notificacionRepository) {
        this.notificacionRepository = notificacionRepository;
    }

    @Transactional
    public Notificacion crearNotificacion(Notificacion notificacion) {
        return notificacionRepository.save(notificacion);
    }

    public Notificacion buscarNotificacionPorId(Long id) {
        return notificacionRepository.findById(id).orElse(null);
    }

    public List<Notificacion> findAll() {
        return notificacionRepository.findAll();
    }

    @Transactional
    public Notificacion actualizarNotificacion(Notificacion notificacion) {
        return notificacionRepository.save(notificacion);
    }

    @Transactional
    public void eliminarNotificacion(Long id) {
        notificacionRepository.deleteById(id);
    }
}



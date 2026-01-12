package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.Mensaje;
import com.example.deckbuilder.repository.MensajeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MensajeService {

    private final MensajeRepository mensajeRepository;

    public MensajeService(MensajeRepository mensajeRepository) {
        this.mensajeRepository = mensajeRepository;
    }

    public List<Mensaje> findAll() {
        return mensajeRepository.findAll();
    }

    public List<Mensaje> findByUsuarioId(Long usuarioId) {
        return mensajeRepository.findByUsuarioId(usuarioId);
    }

    public Mensaje crearMensaje(Mensaje mensaje) {
        return mensajeRepository.save(mensaje);
    }
}
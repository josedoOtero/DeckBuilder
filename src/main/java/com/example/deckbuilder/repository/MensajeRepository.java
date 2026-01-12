package com.example.deckbuilder.repository;

import com.example.deckbuilder.domain.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    List<Mensaje> findByUsuarioId(Long usuarioId);
}


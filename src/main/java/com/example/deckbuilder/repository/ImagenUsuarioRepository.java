package com.example.deckbuilder.repository;

import com.example.deckbuilder.domain.ImagenUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface ImagenUsuarioRepository extends JpaRepository<ImagenUsuario, Long> {
}

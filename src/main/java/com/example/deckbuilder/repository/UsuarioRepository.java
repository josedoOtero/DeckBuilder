package com.example.deckbuilder.repository;

import com.example.deckbuilder.domain.Mazo;
import com.example.deckbuilder.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    List<Usuario> findByMazosFavoritosContaining(Mazo mazo);
}

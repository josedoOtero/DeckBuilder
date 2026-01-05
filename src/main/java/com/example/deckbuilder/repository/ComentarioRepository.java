package com.example.deckbuilder.repository;

import com.example.deckbuilder.domain.Comentario;
import com.example.deckbuilder.domain.Mazo;
import com.example.deckbuilder.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    Optional<Comentario> findByMazoAndUsuario(Mazo mazo, Usuario usuario);
    List<Comentario> findByUsuario(Usuario usuario);
    List<Comentario> findByMazo(Mazo mazo);
}

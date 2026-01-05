package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.Comentario;
import com.example.deckbuilder.domain.Mazo;
import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.repository.ComentarioRepository;
import com.example.deckbuilder.repository.MazoRepository;
import com.example.deckbuilder.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final MazoRepository mazoRepository;
    private final UsuarioRepository usuarioRepository;

    public ComentarioService(ComentarioRepository comentarioRepository, MazoRepository mazoRepository, UsuarioRepository usuarioRepository) {
        this.comentarioRepository = comentarioRepository;
        this.mazoRepository = mazoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Comentario crearComentario(Long idMazo, Long idUsuario, Comentario comentario) {
        Mazo mazo = mazoRepository.findById(idMazo).orElseThrow(() -> new EntityNotFoundException("Mazo no encontrado"));
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        // comprobar si ya existe
        if (comentarioRepository.findByMazoAndUsuario(mazo, usuario).isPresent()) {
            throw new DataIntegrityViolationException("El usuario ya comentó este mazo");
        }

        // validar valoracion
        if (comentario.getValoracion() == null || comentario.getValoracion() < 1 || comentario.getValoracion() > 5) {
            throw new DataIntegrityViolationException("La valoracion debe estar entre 1 y 5");
        }

        comentario.setMazo(mazo);
        comentario.setUsuario(usuario);
        comentario.setCreadoEn(LocalDateTime.now());

        return comentarioRepository.save(comentario);
    }

    public Comentario findById(Long id) {
        return comentarioRepository.findById(id).orElse(null);
    }

    public List<Comentario> findAll() {
        return comentarioRepository.findAll();
    }

    @Transactional
    public Comentario editarComentario(Long idComentario, Comentario cambios) {
        Comentario existente = comentarioRepository.findById(idComentario)
                .orElseThrow(() -> new EntityNotFoundException("Comentario no encontrado"));

        // Actualizar mensaje y valoracion
        if (cambios.getMensaje() != null) existente.setMensaje(cambios.getMensaje());
        if (cambios.getValoracion() != null) {
            if (cambios.getValoracion() < 1 || cambios.getValoracion() > 5) {
                throw new DataIntegrityViolationException("La valoracion debe estar entre 1 y 5");
            }
            existente.setValoracion(cambios.getValoracion());
        }
        return comentarioRepository.save(existente);
    }

    @Transactional
    public void borrarComentario(Long idComentario) {
        Comentario existente = comentarioRepository.findById(idComentario)
                .orElseThrow(() -> new EntityNotFoundException("Comentario no encontrado"));

        comentarioRepository.delete(existente);
    }

    public List<Comentario> listarPorUsuario(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        return comentarioRepository.findByUsuario(usuario);
    }

    public List<Comentario> listarPorMazo(Long idMazo) {
        Mazo mazo = mazoRepository.findById(idMazo).orElseThrow(() -> new EntityNotFoundException("Mazo no encontrado"));
        return comentarioRepository.findByMazo(mazo);
    }
}

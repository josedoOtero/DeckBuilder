package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.Mazo;
import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.domain.partesMazo.ExtraDeck;
import com.example.deckbuilder.domain.partesMazo.MainDeck;
import com.example.deckbuilder.domain.partesMazo.SideDeck;
import com.example.deckbuilder.repository.MazoRepository;
import com.example.deckbuilder.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class MazoService {
    MazoRepository mazoRepository;
    UsuarioRepository usuarioRepository;

    MazoService(MazoRepository mazoRepository, UsuarioRepository usuarioRepository) {
        this.mazoRepository = mazoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Mazo save(Mazo mazo) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            usuarioRepository.findByNombre(userDetails.getUsername())
                    .ifPresent(mazo::setCreador);
        }

        if (mazo.getMainDeck() == null) mazo.setMainDeck(new MainDeck());
        if (mazo.getExtraDeck() == null) mazo.setExtraDeck(new ExtraDeck());
        if (mazo.getSideDeck() == null) mazo.setSideDeck(new SideDeck());

        return mazoRepository.save(mazo);
    }

    public Mazo findById(Long id) {
        return mazoRepository.findById(id).orElse(null);
    }

    public List<Mazo> findAll() {
        return mazoRepository.findAll();
    }

    public Mazo replace(Long id, Mazo nuevoMazo) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            usuarioRepository.findByNombre(userDetails.getUsername())
                    .ifPresent(nuevoMazo::setCreador);
        }

        return mazoRepository.findById(id)
                .map(mazoExistente -> {
                    mazoExistente.setNombre(nuevoMazo.getNombre());
                    mazoExistente.setEstado(nuevoMazo.getEstado());
                    mazoExistente.setVistas(nuevoMazo.getVistas());
                    mazoExistente.setImagenCartaDestacada(nuevoMazo.getImagenCartaDestacada());
                    mazoExistente.setCreador(nuevoMazo.getCreador());
                    mazoExistente.setMainDeck(nuevoMazo.getMainDeck());
                    mazoExistente.setExtraDeck(nuevoMazo.getExtraDeck());
                    mazoExistente.setSideDeck(nuevoMazo.getSideDeck());
                    return mazoRepository.save(mazoExistente);
                })
                .orElseGet(() -> {
                    nuevoMazo.setId(id);
                    return mazoRepository.save(nuevoMazo);
                });
    }


    @Transactional
    public void delete(Long id) {
        Mazo mazo = mazoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("El mazo no existe"));
        
        mazo.getCreador().getMazosFavoritos().remove(mazo);
        mazoRepository.flush();

        mazoRepository.delete(mazo);
    }


    public List<Mazo> findByUsuario(Usuario usuario) {
        return mazoRepository.findAllByCreador(usuario);
    }

    public List<Mazo> obtenerMazosPublicos() {
        return mazoRepository.findByEstado("publico");
    }

    public List<Mazo> obtenerMazosPublicosFindByUsuario(Usuario usuario) {
        List<Mazo> mazos = new ArrayList<>(mazoRepository.findAllByCreador(usuario));

        return mazos.stream()
                .filter(m -> "publico".equalsIgnoreCase(m.getEstado()))
                .toList();
    }

    public List<Mazo> buscarPorNombreCreadorONombreMazo(String nombreCreador, String nombreMazo) {
        String creador = nombreCreador != null ? nombreCreador.toLowerCase() : null;
        String mazo = nombreMazo != null ? nombreMazo.toLowerCase() : null;

        List<Mazo> todos = mazoRepository.findAll();

        return todos.stream()
                .filter(m ->
                        (mazo == null || m.getNombre().toLowerCase().contains(mazo)) &&
                                (creador == null || m.getCreador().getNombre().toLowerCase().contains(creador))
                )
                .toList();
    }


    public List<Mazo> buscarMazosPublicos(String nombreMazo, String nombreCreador) {
        if ((nombreMazo == null || nombreMazo.isBlank()) && (nombreCreador == null || nombreCreador.isBlank())) {
            return obtenerMazosPublicos();
        }
        return mazoRepository.findByNombreContainingIgnoreCaseAndCreadorNombreContainingIgnoreCase(
                nombreMazo == null ? "" : nombreMazo,
                nombreCreador == null ? "" : nombreCreador
        );
    }

}
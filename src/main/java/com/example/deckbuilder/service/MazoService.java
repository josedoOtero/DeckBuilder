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
        if(mazoRepository.existsById(id)) {
            mazoRepository.deleteById(id);
        } else {
            throw new RuntimeException("El mazo no existe");
        }
    }

    public List<Mazo> findByUsuario(Usuario usuario) {
        return mazoRepository.findAllByCreador(usuario);
    }

    public List<Mazo> obtenerMazosPublicos() {
        return mazoRepository.findByEstado("publico");
    }
}
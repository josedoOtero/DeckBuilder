package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.Mazo;
import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.repository.MazoRepository;
import com.example.deckbuilder.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service

public class MazoService {
    MazoRepository mazoRepository;
    UsuarioRepository usuarioRepository;

    MazoService (MazoRepository mazoRepository, UsuarioRepository usuarioRepository) {

        this.mazoRepository = mazoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Mazo save(Mazo mazo) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            Optional<Usuario> usuario = usuarioRepository.findByNombre(userDetails.getUsername());
            mazo.setCreador(usuario.get());
        }
        return mazoRepository.save(mazo);
    }

    public Mazo findById(Long id) {
        return mazoRepository.findById(id).orElse(null);
    }

    public List<Mazo> findAll() {
        return mazoRepository.findAll();
    }

    public Mazo replace(Long id, Mazo nuevoMazo) {
        return mazoRepository.findById(id)
                .map(mazoExistente -> {
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
    public Mazo delete(Long id) {
        Mazo mazo = mazoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Mazo no encontrado con id: " + id));

        List<Usuario> usuariosConFavorito = usuarioRepository.findByMazosFavoritosContaining(mazo);
        usuariosConFavorito.forEach(usuario -> usuario.getMazosFavoritos().remove(mazo));
        usuarioRepository.saveAll(usuariosConFavorito);

        if (mazo.getCreador() != null) {
            Usuario creador = mazo.getCreador();
            creador.getMazos().remove(mazo);
            usuarioRepository.save(creador);
            mazo.setCreador(null);
        }

        mazoRepository.delete(mazo);
        return mazo;
    }


    public List<Mazo> findByUsuario(Usuario usuario) {
        return mazoRepository.findAllByCreador(usuario);
    }
}

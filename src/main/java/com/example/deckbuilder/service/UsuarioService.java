package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.Mazo;
import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class UsuarioService {
    UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Set<Mazo> getAllMazos(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElse(null);

        if(usuario != null) {
            return usuario.getMazos();
        }
        return null;
    }

    public Set<Mazo> getAllMazosFavoritos(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElse(null);

        if(usuario != null) {
            return usuario.getMazosFavoritos();
        }
        return null;
    }

    public Usuario replace(Long id, Usuario nuevoUsuario) {
        return usuarioRepository.findById(id)
                .map(usuarioExistente -> {
                    usuarioExistente.setNombre(nuevoUsuario.getNombre());
                    usuarioExistente.setPassword(nuevoUsuario.getPassword());
                    usuarioExistente.setEmail(nuevoUsuario.getEmail());
                    usuarioExistente.setMazos(nuevoUsuario.getMazos());
                    usuarioExistente.setMazosFavoritos(nuevoUsuario.getMazosFavoritos());
                    usuarioExistente.setImagenUsuario(nuevoUsuario.getImagenUsuario());
                    usuarioExistente.setRol(nuevoUsuario.getRol());
                    return usuarioRepository.save(usuarioExistente);
                })
                .orElseGet(() -> {
                    nuevoUsuario.setId(id);
                    return usuarioRepository.save(nuevoUsuario);
                });
    }


    @Transactional
    public Usuario delete(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));

        usuarioRepository.delete(usuario);
        return usuario;
    }

    public Usuario findByNombre(String nombre) {
        return usuarioRepository.findByNombre(nombre).orElse(null);
    }

    public boolean exitByNombre(String nombre) {
        return usuarioRepository.findByNombre(nombre).isPresent();
    }

    public Usuario registrarUsuario(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRol("ROLE_USER");
        return usuarioRepository.save(usuario);
    }

    public List<Mazo> obtenerMazosPublicos(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + idUsuario));

        return usuario.getMazos()
                .stream()
                .filter(m -> m.getEstado() != null && m.getEstado().equalsIgnoreCase("publico"))
                .toList();
    }



}

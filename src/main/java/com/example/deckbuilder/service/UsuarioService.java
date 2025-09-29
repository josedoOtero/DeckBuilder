package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service

public class UsuarioService {
    UsuarioRepository usuarioRepository;

    UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        usuarioRepository.deleteById(id);
    }
}

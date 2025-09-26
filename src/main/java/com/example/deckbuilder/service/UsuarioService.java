package com.example.deckbuilder.service;

import com.example.deckbuilder.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service

public class UsuarioService {
    UsuarioRepository usuarioRepository;

    UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
}

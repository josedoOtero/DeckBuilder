package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.ImagenUsuario;
import com.example.deckbuilder.repository.ImagenUsuarioRepository;
import org.springframework.stereotype.Service;

@Service

public class ImagenUsuarioService {
    ImagenUsuarioRepository imagenUsuarioRepository;

    ImagenUsuarioService(ImagenUsuarioRepository imagenUsuarioRepository) {
        this.imagenUsuarioRepository = imagenUsuarioRepository;
    }
}

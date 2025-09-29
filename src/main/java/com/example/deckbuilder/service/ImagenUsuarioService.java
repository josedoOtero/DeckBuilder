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

    public ImagenUsuario save(ImagenUsuario imagenUsuario) {
        return imagenUsuarioRepository.save(imagenUsuario);
    }

    public ImagenUsuario findById(Long id) {
        return imagenUsuarioRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        imagenUsuarioRepository.deleteById(id);
    }
}

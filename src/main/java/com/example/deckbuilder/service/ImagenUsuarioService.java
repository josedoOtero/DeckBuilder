package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.ImagenUsuario;
import com.example.deckbuilder.repository.ImagenUsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service

public class ImagenUsuarioService {
    ImagenUsuarioRepository imagenUsuarioRepository;

    ImagenUsuarioService(ImagenUsuarioRepository imagenUsuarioRepository) {
        this.imagenUsuarioRepository = imagenUsuarioRepository;
    }

    public ImagenUsuario save(ImagenUsuario imagenUsuario) {
        return imagenUsuarioRepository.save(imagenUsuario);
    }

    public List<ImagenUsuario> findAll() {
        return imagenUsuarioRepository.findAll();
    }

    public ImagenUsuario findById(Long id) {
        return imagenUsuarioRepository.findById(id).orElse(null);
    }

    @Transactional
    public ImagenUsuario delete(Long id) {
        ImagenUsuario imagen = imagenUsuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ImagenUsuario no encontrada con id: " + id));

        imagenUsuarioRepository.delete(imagen);
        return imagen;
    }

    public ImagenUsuario replace(Long id, ImagenUsuario nuevaImagen) {
        return imagenUsuarioRepository.findById(id)
                .map(imagenExistente -> {
                    imagenExistente.setDirecion(nuevaImagen.getDirecion());
                    return imagenUsuarioRepository.save(imagenExistente);
                })
                .orElseGet(() -> {
                    nuevaImagen.setId(id);
                    return imagenUsuarioRepository.save(nuevaImagen);
                });
    }

}

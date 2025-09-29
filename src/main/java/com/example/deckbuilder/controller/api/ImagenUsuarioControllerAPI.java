package com.example.deckbuilder.controller.api;

import com.example.deckbuilder.service.ImagenUsuarioService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/ImagenUsuarioAPI")

public class ImagenUsuarioControllerAPI {
    ImagenUsuarioService imagenUsuarioService;

    ImagenUsuarioControllerAPI(ImagenUsuarioService imagenUsuarioService) {
        this.imagenUsuarioService = imagenUsuarioService;
    }
}

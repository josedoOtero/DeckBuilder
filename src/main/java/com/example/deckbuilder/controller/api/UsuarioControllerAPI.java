package com.example.deckbuilder.controller.api;

import com.example.deckbuilder.service.UsuarioService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/UsuarioAPI")

public class UsuarioControllerAPI {
    UsuarioService usuarioService;

    UsuarioControllerAPI(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }
}

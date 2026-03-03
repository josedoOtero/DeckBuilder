package com.example.deckbuilder.controller;

import com.example.deckbuilder.utility.UsuarioDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller

/*Controlador para devolver el usuario autentificado (por si necesitas info de este)*/

public class GlobalController {

    @ModelAttribute("usuarioDetails")
    public UsuarioDetails usuarioDetails(@AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        return usuarioDetails;
    }
}

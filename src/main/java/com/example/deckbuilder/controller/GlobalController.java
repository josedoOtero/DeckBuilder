package com.example.deckbuilder.controller;

import com.example.deckbuilder.utility.UsuarioDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class GlobalController {

    @ModelAttribute("usuarioLogueado")
    public UsuarioDetails usuarioLogueado(@AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        return usuarioDetails;
    }
}

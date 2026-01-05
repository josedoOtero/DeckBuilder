package com.example.deckbuilder.utility;

import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.service.UsuarioService;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.security.Principal;

@ControllerAdvice
public class GlobalControllerAdvice {

    private final UsuarioService usuarioService;

    public GlobalControllerAdvice(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @ModelAttribute("usuarioLogueado")
    public Usuario agregarUsuarioLogueado(Principal principal) {
        if (principal != null) {
            Usuario usuario = usuarioService.findByNombre(principal.getName());
            if (usuario != null) {
                return usuario;
            }
        }
        return null;
    }
}

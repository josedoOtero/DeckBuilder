package com.example.deckbuilder.controller.templete;

import org.springframework.ui.Model;
import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.service.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class LoginController {

    private final UsuarioService usuarioService;

    public LoginController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/")
    public String mostrarIndex() {
        return "index";
    }

    @GetMapping("/login")
    public String mostrarLogin() {
        return "login-page";
    }

    @GetMapping("/register")
    public String mostrarRegistro(Model model) {
        model.addAttribute("usuario", new Usuario());
        return "register";
    }

    @PostMapping("/registro")
    public String registrarUsuario(@ModelAttribute Usuario usuario, Model model) {
        if (usuarioService.exitByNombre(usuario.getNombre())) {
            model.addAttribute("error", "El nombre de usuario ya existe");
            return "registro";
        }

        usuarioService.registrarUsuario(usuario);
        model.addAttribute("exito", "Cuenta creada correctamente, ahora inicia sesión");
        return "login";
    }
}

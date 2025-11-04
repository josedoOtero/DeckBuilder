package com.example.deckbuilder.controller.templete;

import org.springframework.ui.Model;
import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.service.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.core.Authentication;

@Controller
@RequestMapping("/login")
public class LoginController {

    private final UsuarioService usuarioService;

    public LoginController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/iniciarSesion")
    public String mostrarLogin(Authentication auth) {
        if (auth != null && auth.isAuthenticated()) {
            return "redirect:/user/home";
        }
        return "login-page";
    }

    @GetMapping("/crearCuenta")
    public String mostrarRegistro(Model model) {
        model.addAttribute("usuario", new Usuario());
        return "register";
    }

    @PostMapping("/crearCuenta")
    public String registrarUsuario(@ModelAttribute Usuario usuario, Model model) {
        if (usuarioService.exitByNombre(usuario.getNombre())) {
            model.addAttribute("error", "El nombre de usuario ya existe");
            return "register";
        }

        usuarioService.registrarUsuario(usuario);
        model.addAttribute("exito", "Cuenta creada correctamente, ahora inicia sesión");
        return "redirect:/login/iniciarSesion";
    }
}


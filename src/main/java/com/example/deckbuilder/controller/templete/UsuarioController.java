package com.example.deckbuilder.controller.templete;

import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.service.UsuarioService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/user")
public class UsuarioController {

    UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/mazos")
    public String verMazos() {
        return "ventanasUsuario/ver-mazos";
    }

    @GetMapping("/misMazos")
    public String misMazos() {
        return "ventanasUsuario/mis-mazos";
    }

    @GetMapping("/constructorMazos")
    public String constructorMazo() {
        return "ventanasUsuario/constructor-mazos";
    }

    @GetMapping("/constructorMazos/{id}")
    public String mostrarConstructorMazos(@PathVariable Long id, Model model) {
        model.addAttribute("id", id);
        return "ventanasUsuario/constructor-mazos";
    }

    @GetMapping("/visualizadorMazos/{id}")
    public String mostrarrMazo(@PathVariable Long id, Model model) {
        model.addAttribute("id", id);
        return "ventanasUsuario/visualizador-mazos";
    }

    @GetMapping("/verUser/{id}")
    public String mostrarrUser(@PathVariable Long id, Model model) {
        model.addAttribute("id", id);
        return "ventanasUsuario/ver-usuario";
    }

    @GetMapping("/perfil")
    public String mostrarPerfil(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        Usuario usuario = usuarioService.findByNombre(userDetails.getUsername());
        model.addAttribute("usuario", usuario);
        return "ventanasUsuario/editar-perfil";
    }

    @PostMapping("/perfil")
    public String actualizarPerfil(@ModelAttribute Usuario usuario, @AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuarioActual = usuarioService.findByNombre(userDetails.getUsername());

        usuarioActual.setNombre(usuario.getNombre());
        if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
            usuarioActual.setPassword(usuario.getPassword());
        }

        usuarioService.save(usuarioActual);
        return "redirect:/login/home";
    }

}

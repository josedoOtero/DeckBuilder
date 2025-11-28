package com.example.deckbuilder.controller.templete;

import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
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

    @GetMapping("/misMazos")
    public String misMazos(Model model, HttpServletRequest request) {
        model.addAttribute("currentUri", request.getRequestURI());
        return "ventanasUsuario/mis-mazos";
    }

    @GetMapping("/constructorMazos")
    public String constructorMazo(Model model, HttpServletRequest request) {
        model.addAttribute("currentUri", request.getRequestURI());
        return "ventanasUsuario/constructor-mazos";
    }

    @GetMapping("/constructorMazos/{id}")
    public String mostrarConstructorMazos(@PathVariable Long id, Model model, HttpServletRequest request) {
        model.addAttribute("id", id);
        model.addAttribute("currentUri", request.getRequestURI());
        return "ventanasUsuario/constructor-mazos";
    }

    @GetMapping("/visualizadorMazos/{id}")
    public String mostrarrMazo(@PathVariable Long id, Model model, HttpServletRequest request) {
        model.addAttribute("id", id);
        model.addAttribute("currentUri", request.getRequestURI());
        return "ventanasUsuario/visualizador-mazos";
    }

    @GetMapping("/perfil")
    public String mostrarPerfil(@AuthenticationPrincipal UserDetails userDetails, Model model, HttpServletRequest request) {
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

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
        usuarioActual.setDescripcion(usuario.getDescripcion());

        if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
            usuarioActual.setPassword(usuario.getPassword());
        }

        usuarioService.save(usuarioActual);

        return "redirect:/login/home";
    }


    @GetMapping("/cuenta-editar/{id}")
    public String mostrarPerfil(@PathVariable Long id, Model model) {
        Usuario usuario = usuarioService.findById(id);

        if (usuario == null) {
            return "redirect:/error";
        }

        model.addAttribute("usuario", usuario);
        return "ventanaAdministrador/editar-perfil";
    }

    @PostMapping("/cuenta-editar/{id}")
    public String actualizarPerfil(@PathVariable Long id, @ModelAttribute Usuario usuarioForm
    ) {
        Usuario usuarioActual = usuarioService.findById(id);

        if (usuarioActual == null) {
            return "redirect:/error";
        }

        usuarioActual.setNombre(usuarioForm.getNombre());
        usuarioActual.setDescripcion(usuarioForm.getDescripcion());

        if (usuarioForm.getPassword() != null && !usuarioForm.getPassword().isBlank()) {
            usuarioActual.setPassword(usuarioForm.getPassword());
        }

        usuarioService.save(usuarioActual);

        return "redirect:/login/home";
    }

    @GetMapping("/favoritas")
    public String mostrarCartasFavoritas(@AuthenticationPrincipal UserDetails userDetails, Model model, HttpServletRequest request) {
        Usuario usuario = usuarioService.findByNombre(userDetails.getUsername());
        model.addAttribute("usuario", usuario);
        return "ventanasUsuario/mis-favoritas";
    }
}

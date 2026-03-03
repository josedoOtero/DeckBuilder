package com.example.deckbuilder.controller.templete;

import com.example.deckbuilder.domain.Usuario;
import com.example.deckbuilder.dto.CambioPasswordDTO;
import com.example.deckbuilder.service.UsuarioService;
import com.example.deckbuilder.utility.UsuarioDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/user")

/*Controlador para usuarios auterntificados, puedes entrar user y admin*/

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

    @GetMapping("/perfil")
    public String mostrarPerfil(@AuthenticationPrincipal UserDetails userDetails, Model model) {

        Usuario usuario = usuarioService.findByNombre(userDetails.getUsername());
        model.addAttribute("usuario", usuario);

        model.addAttribute("passwordDTO", new CambioPasswordDTO());

        return "ventanasUsuario/editar-perfil";
    }


    @PostMapping("/perfil")
    public String actualizarPerfil(
            @ModelAttribute("usuario") Usuario usuario,
            @AuthenticationPrincipal UserDetails userDetails,
            Model model) {

        Usuario usuarioActual = usuarioService.findByNombre(userDetails.getUsername());
        if (usuarioActual == null) {
            return "redirect:/login";
        }

        usuarioActual.setDescripcion(usuario.getDescripcion());
        usuarioActual.setImagenUsuario(usuario.getImagenUsuario());

        if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
            usuarioActual.setPassword(usuarioService.encodePassword(usuario.getPassword()));
        }

        usuarioService.save(usuarioActual);

        return "redirect:/login/home";
    }


    @PostMapping("/perfil/password")
    public String cambiarPassword(
            @Valid @ModelAttribute("passwordDTO") CambioPasswordDTO passwordDTO,
            BindingResult result,
            @AuthenticationPrincipal UserDetails userDetails,
            Model model) {

        if (!passwordDTO.getNueva().equals(passwordDTO.getRepetir())) {
            result.rejectValue("repetir", "error.password", "Passwords do not match");
        }

        if (result.hasErrors()) {
            Usuario usuario = usuarioService.findByNombre(userDetails.getUsername());
            model.addAttribute("usuario", usuario);
            return "ventanasUsuario/editar-perfil";
        }

        usuarioService.cambiarPassword(userDetails.getUsername(), passwordDTO.getNueva());

        return "redirect:/user/perfil";
    }

    @PostMapping("/perfil/passwordUser")
    public String cambiarPasswordUser(
            @Valid @ModelAttribute("passwordDTO") CambioPasswordDTO passwordDTO,
            BindingResult result,
            @AuthenticationPrincipal UserDetails userDetails,
            Model model) {

        Usuario usuario = usuarioService.findByNombre(userDetails.getUsername());

        if (usuario == null) {
            return "redirect:/login";
        }

        if (!usuarioService.passwordMatches(passwordDTO.getActual(), usuario.getPassword())) {
            result.rejectValue("actual", "error.password", "Current password is incorrect");
        }

        if (!passwordDTO.getNueva().equals(passwordDTO.getRepetir())) {
            result.rejectValue("repetir", "error.password", "Passwords do not match");
        }

        if (result.hasErrors()) {
            model.addAttribute("usuario", usuario);
            model.addAttribute("passwordDTO", passwordDTO);
            return "ventanasUsuario/editar-perfil";
        }

        usuarioService.cambiarPassword(usuario.getNombre(), passwordDTO.getNueva());

        return "redirect:/user/perfil?success";
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

    @GetMapping("/notificaciones")
    public String mostrarNotificaciones(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.getPrincipal() instanceof UsuarioDetails usuarioDetails) {
            Usuario usuario = usuarioDetails.getUsuario();
            model.addAttribute("usuario", usuario); // paso completo
        } else {
            return "redirect:/login";
        }

        return "ventanasUsuario/notificaciones";
    }
}

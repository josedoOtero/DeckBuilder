package com.example.deckbuilder.controller.templete;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdministradorController {

    @GetMapping("/panel")
    public String panel(Model model, HttpServletRequest request) {
        model.addAttribute("currentUri", request.getRequestURI());
        return "ventanaAdministrador/panelAdmin";
    }

    @GetMapping("/panelUsuario")
    public String panelUsuario(Model model, HttpServletRequest request) {
        model.addAttribute("currentUri", request.getRequestURI());
        return "ventanaAdministrador/panelAdminUsuarios";
    }

    @GetMapping("/panelMazos")
    public String panelMazos(Model model, HttpServletRequest request) {
        model.addAttribute("currentUri", request.getRequestURI());
        return "ventanaAdministrador/panelAdminMazos";
    }

    @GetMapping("/crearNotificacion")
    public String crearNotificacion(Model model, HttpServletRequest request) {
        model.addAttribute("currentUri", request.getRequestURI());
        return "ventanaAdministrador/crear-notificacion";
    }
}

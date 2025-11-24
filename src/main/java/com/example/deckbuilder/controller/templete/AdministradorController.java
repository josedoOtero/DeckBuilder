package com.example.deckbuilder.controller.templete;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdministradorController {

    @GetMapping("/panel")
    public String panel() {
        return "ventanaAdministrador/panelAdmin";
    }

    @GetMapping("/panelUsuario")
    public String panelUsuario() {
        return "ventanaAdministrador/panelAdminUsuarios";
    }

    @GetMapping("/panelMazos")
    public String panelMazos() {
        return "ventanaAdministrador/panelAdminMazos";
    }

    @GetMapping("/panelAcciones")
    public String panelAciones() {
        return "ventanaAdministrador/panelAdminActions";
    }
}

package com.example.deckbuilder.controller.templete;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/user")
public class UsuarioController {


    @GetMapping("/home")
    public String home() {
        return "ventanasUsuario/user-home";
    }

    @GetMapping("/cartas")
    public String verCartas() {
        return "ventanasUsuario/ver-cartas";
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

}

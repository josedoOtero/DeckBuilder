package com.example.deckbuilder.controller.api;

import com.example.deckbuilder.domain.Carta;
import com.example.deckbuilder.domain.ImagenUsuario;
import com.example.deckbuilder.service.ImagenUsuarioService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/ImagenUsuarioAPI")

public class ImagenUsuarioControllerAPI {
    ImagenUsuarioService imagenUsuarioService;

    ImagenUsuarioControllerAPI(ImagenUsuarioService imagenUsuarioService) {
        this.imagenUsuarioService = imagenUsuarioService;
    }

    //*FUNCIONES DEL CRUD*//

    @GetMapping(value = {"","/"})
    public List<ImagenUsuario> all(){
        return imagenUsuarioService.findAll();
    }

    @PostMapping({"","/"})
    public ImagenUsuario newImagenUsuario(@RequestBody ImagenUsuario imagenUsuario) {
        return this.imagenUsuarioService.save(imagenUsuario);
    }

    @GetMapping("/{id}")
    public ImagenUsuario one(@PathVariable("id") Long id) {
        return this.imagenUsuarioService.findById(id);
    }

    @PutMapping("/{id}")
    public ImagenUsuario replaceImagenUsuario(@PathVariable("id") Long id, @RequestBody ImagenUsuario imagenUsuario) {
        return this.imagenUsuarioService.replace(id, imagenUsuario);
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public ImagenUsuario deleteCarta(@PathVariable("id") Long id) {
        return this.imagenUsuarioService.delete(id);
    }
}

package com.example.deckbuilder.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="imagen_usuario")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class ImagenUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La direcion no puede estar en blanco")
    private String direcion;

}

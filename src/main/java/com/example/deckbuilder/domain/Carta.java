package com.example.deckbuilder.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="carta")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Carta {

    @Id
    private Integer idKonami;

    @NotNull(message = "El nombre no puede ser nulo")
    private String nombre;

    @NotNull(message = "El tipo no puede ser nulo")
    private String tipo;

    @NotNull(message = "La descripcion no puede ser nula")
    private String descripcion;

    @Min(value = 0, message = "El ataque no puede ser negativo")
    private Integer atk;

    @Min(value = 0, message = "La defensa no puede ser negativa")
    private Integer def;

    @Min(value = 0, message = "El nivel no puede ser negativo")
    private Integer nivel;

    private String atributo;

    private String raza;

    @NotNull(message = "La imagen no puede ser nula")
    private String imagen;
}


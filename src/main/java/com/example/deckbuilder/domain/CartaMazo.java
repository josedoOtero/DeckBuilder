package com.example.deckbuilder.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="carta_mazo")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartaMazo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "mazo_id", nullable = false)
    private Mazo mazo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "carta_id", nullable = false)
    private Carta carta;

    @NotNull
    @Min(value = 1)
    @Max(value = 3)
    private Integer cantidad;
}


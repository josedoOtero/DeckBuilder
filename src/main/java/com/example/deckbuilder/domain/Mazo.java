package com.example.deckbuilder.domain;

import com.example.deckbuilder.domain.partesMazo.ExtraDeck;
import com.example.deckbuilder.domain.partesMazo.MainDeck;
import com.example.deckbuilder.domain.partesMazo.SideDeck;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mazo")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Mazo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String estado;

    private int vistas = 0;

    private String imagenCartaDestacada;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @JsonBackReference
    private Usuario creador;


    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "main_deck_id")
    private MainDeck mainDeck;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "extra_deck_id")
    private ExtraDeck extraDeck;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "side_deck_id")
    private SideDeck sideDeck;
}


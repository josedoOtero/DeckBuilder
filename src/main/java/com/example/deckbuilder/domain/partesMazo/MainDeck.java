package com.example.deckbuilder.domain.partesMazo;

import com.example.deckbuilder.domain.Carta;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name="main_deck")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class MainDeck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "main_deck_id")
    private List<Carta> cartas;
}

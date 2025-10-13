package com.example.deckbuilder.domain.partesMazo;

import com.example.deckbuilder.domain.Carta;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name="extra_deck")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExtraDeck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "extra_deck_id")
    private List<Carta> cartas;
}


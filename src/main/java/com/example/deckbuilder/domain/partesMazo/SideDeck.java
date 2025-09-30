package com.example.deckbuilder.domain.partesMazo;

import com.example.deckbuilder.domain.CartaMazo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name="side_deck")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class SideDeck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "side_deck_id")
    private List<CartaMazo> cartas;
}

package com.example.deckbuilder.repository.partesMazo;

import com.example.deckbuilder.domain.Carta;
import com.example.deckbuilder.domain.partesMazo.MainDeck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface MainDeckRepository extends JpaRepository<MainDeck, Long> {
    List<MainDeck> findByCartasContaining(Carta carta);
}

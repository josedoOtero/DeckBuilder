package com.example.deckbuilder.repository.partesMazo;

import com.example.deckbuilder.domain.partesMazo.SideDeck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface SideDeckRepository extends JpaRepository<SideDeck, Long> {
}

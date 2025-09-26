package com.example.deckbuilder.repository.partesMazo;

import com.example.deckbuilder.domain.partesMazo.MainDeck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface MainDeckRepository extends JpaRepository<MainDeck, Long> {
}

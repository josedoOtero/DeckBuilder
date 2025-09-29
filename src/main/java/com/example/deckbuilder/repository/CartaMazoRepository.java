package com.example.deckbuilder.repository;

import com.example.deckbuilder.domain.Carta;
import com.example.deckbuilder.domain.CartaMazo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface CartaMazoRepository extends JpaRepository<CartaMazo, Long> {

    List<CartaMazo> findByCarta(Carta carta);
}

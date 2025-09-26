package com.example.deckbuilder.repository;

import com.example.deckbuilder.domain.CartaMazo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface CartaMazoRepository extends JpaRepository<CartaMazo, Long> {
}

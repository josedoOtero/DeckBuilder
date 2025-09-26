package com.example.deckbuilder.service;

import com.example.deckbuilder.repository.CartaRepository;
import org.springframework.stereotype.Service;

@Service

public class CartaService {
    CartaRepository cartaRepository;

    CartaService(CartaRepository cartaRepository) {
        this.cartaRepository = cartaRepository;
    }
}

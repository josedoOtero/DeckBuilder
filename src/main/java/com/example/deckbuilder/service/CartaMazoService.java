package com.example.deckbuilder.service;

import com.example.deckbuilder.repository.CartaMazoRepository;
import org.springframework.stereotype.Service;

@Service

public class CartaMazoService {
    CartaMazoRepository cartaMazoRepository;

    CartaMazoService(CartaMazoRepository cartaMazoRepository) {
        this.cartaMazoRepository = cartaMazoRepository;
    }
}

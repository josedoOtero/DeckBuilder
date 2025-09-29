package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.CartaMazo;
import com.example.deckbuilder.repository.CartaMazoRepository;
import org.springframework.stereotype.Service;

@Service

public class CartaMazoService {
    CartaMazoRepository cartaMazoRepository;

    CartaMazoService(CartaMazoRepository cartaMazoRepository) {
        this.cartaMazoRepository = cartaMazoRepository;
    }

    public CartaMazo save(CartaMazo cartaMazo) {
        return cartaMazoRepository.save(cartaMazo);
    }

    public CartaMazo findById(Long id) {
        return cartaMazoRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        cartaMazoRepository.deleteById(id);
    }
}

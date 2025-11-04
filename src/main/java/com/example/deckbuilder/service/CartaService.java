package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.Carta;
import com.example.deckbuilder.domain.partesMazo.ExtraDeck;
import com.example.deckbuilder.domain.partesMazo.MainDeck;
import com.example.deckbuilder.domain.partesMazo.SideDeck;
import com.example.deckbuilder.repository.CartaRepository;
import com.example.deckbuilder.repository.partesMazo.ExtraDeckRepository;
import com.example.deckbuilder.repository.partesMazo.MainDeckRepository;
import com.example.deckbuilder.repository.partesMazo.SideDeckRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service

public class CartaService {
    CartaRepository cartaRepository;
    MainDeckRepository mainDeckRepository;
    ExtraDeckRepository extraDeckRepository;
    SideDeckRepository sideDeckRepository;


    CartaService(CartaRepository cartaRepository, MainDeckRepository mainDeckRepository, ExtraDeckRepository extraDeckRepository, SideDeckRepository sideDeckRepository) {
        this.cartaRepository = cartaRepository;
        this.mainDeckRepository = mainDeckRepository;
        this.extraDeckRepository = extraDeckRepository;
        this.sideDeckRepository = sideDeckRepository;

    }

    public Carta save(Carta carta) {
        return cartaRepository.save(carta);
    }

    public Carta findById(Integer id) {
        return cartaRepository.findById(id).orElse(null);
    }

    public List<Carta> findAll() {
        return cartaRepository.findAll();
    }

    public Carta replace(Integer idKonami, Carta nuevaCarta) {
        nuevaCarta.setIdKonami(idKonami);
        return cartaRepository.save(nuevaCarta);
    }

    @Transactional
    public Carta delete(Integer idKonami) {
        Carta carta = cartaRepository.findById(idKonami)
                .orElseThrow(() -> new EntityNotFoundException("Carta no encontrada con idKonami: " + idKonami));
        List<MainDeck> mains = mainDeckRepository.findByCartasContaining(carta);
        mains.forEach(d -> {
            d.getCartas().remove(carta);
        });
        mainDeckRepository.saveAll(mains);

        List<ExtraDeck> extras = extraDeckRepository.findByCartasContaining(carta);
        extras.forEach(d -> d.getCartas().remove(carta));
        extraDeckRepository.saveAll(extras);

        List<SideDeck> sides = sideDeckRepository.findByCartasContaining(carta);
        sides.forEach(d -> d.getCartas().remove(carta));
        sideDeckRepository.saveAll(sides);

        cartaRepository.delete(carta);
        return carta;
    }
}

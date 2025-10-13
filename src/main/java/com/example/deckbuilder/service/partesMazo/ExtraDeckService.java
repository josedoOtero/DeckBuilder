package com.example.deckbuilder.service.partesMazo;

import com.example.deckbuilder.domain.partesMazo.ExtraDeck;
import com.example.deckbuilder.repository.partesMazo.ExtraDeckRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service

public class ExtraDeckService {
    ExtraDeckRepository extraDeckRepository;

    ExtraDeckService(ExtraDeckRepository extraDeckRepository) {
        this.extraDeckRepository = extraDeckRepository;
    }

    public ExtraDeck save(ExtraDeck extraDeck) {
        return extraDeckRepository.save(extraDeck);
    }

    public ExtraDeck findById(Long id) {
        return extraDeckRepository.findById(id).orElse(null);
    }

    public ExtraDeck replace(Long id, ExtraDeck nuevoDeck) {
        return extraDeckRepository.findById(id)
                .map(deckExistente -> {
                    deckExistente.setCartas(nuevoDeck.getCartas());
                    return extraDeckRepository.save(deckExistente);
                })
                .orElseGet(() -> {
                    nuevoDeck.setId(id);
                    return extraDeckRepository.save(nuevoDeck);
                });
    }


    @Transactional
    public ExtraDeck delete(Long id) {
        ExtraDeck extraDeck = extraDeckRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ExtraDeck no encontrado con id: " + id));

        extraDeckRepository.delete(extraDeck);
        return extraDeck;
    }

}

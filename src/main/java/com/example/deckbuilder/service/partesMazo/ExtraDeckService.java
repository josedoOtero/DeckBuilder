package com.example.deckbuilder.service.partesMazo;

import com.example.deckbuilder.domain.partesMazo.ExtraDeck;
import com.example.deckbuilder.repository.partesMazo.ExtraDeckRepository;
import org.springframework.stereotype.Service;

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

    public void delete(Long id) {
        extraDeckRepository.deleteById(id);
    }
}

package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.Mazo;
import com.example.deckbuilder.repository.MazoRepository;
import org.springframework.stereotype.Service;

@Service

public class MazoService {
    MazoRepository mazoRepository;

    MazoService (MazoRepository mazoRepository) {
        this.mazoRepository = mazoRepository;
    }

    public Mazo save(Mazo mazo) {
        return mazoRepository.save(mazo);
    }

    public Mazo mazoById(Long id) {
        return mazoRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        mazoRepository.deleteById(id);
    }
}

package com.example.deckbuilder.service;

import com.example.deckbuilder.repository.MazoRepository;
import org.springframework.stereotype.Service;

@Service

public class MazoService {
    MazoRepository mazoRepository;

    MazoService (MazoRepository mazoRepository) {
        this.mazoRepository = mazoRepository;
    }
}

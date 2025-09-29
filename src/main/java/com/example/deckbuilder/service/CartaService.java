package com.example.deckbuilder.service;

import com.example.deckbuilder.domain.Carta;
import com.example.deckbuilder.domain.CartaMazo;
import com.example.deckbuilder.repository.CartaMazoRepository;
import com.example.deckbuilder.repository.CartaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service

public class CartaService {
    CartaRepository cartaRepository;
    CartaMazoRepository cartaMazoRepository;

    CartaService(CartaRepository cartaRepository, CartaMazoRepository cartaMazoRepository) {
        this.cartaRepository = cartaRepository;
        this.cartaMazoRepository = cartaMazoRepository;
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
        return cartaRepository.findById(idKonami)
                .map(cartaExistente -> {
                    cartaExistente.setNombre(nuevaCarta.getNombre());
                    cartaExistente.setTipo(nuevaCarta.getTipo());
                    cartaExistente.setDescripcion(nuevaCarta.getDescripcion());
                    cartaExistente.setAtk(nuevaCarta.getAtk());
                    cartaExistente.setDef(nuevaCarta.getDef());
                    cartaExistente.setNivel(nuevaCarta.getNivel());
                    cartaExistente.setAtributo(nuevaCarta.getAtributo());
                    cartaExistente.setRaza(nuevaCarta.getRaza());
                    cartaExistente.setImagen(nuevaCarta.getImagen());
                    return cartaRepository.save(cartaExistente);
                })
                .orElseGet(() -> {
                    // si no existe, creamos una nueva con el id recibido
                    nuevaCarta.setIdKonami(idKonami);
                    return cartaRepository.save(nuevaCarta);
                });
    }


    public Carta findByNombre(String nombre) {
        return cartaRepository.findByNombre(nombre);
    }

    @Transactional
    public Carta delete(Integer idKonami) {
        // 1. Buscar la carta
        Carta carta = cartaRepository.findById(idKonami)
                .orElseThrow(() -> new EntityNotFoundException("Carta no encontrada con idKonami: " + idKonami));

        // 2. Buscar todas las relaciones en CartaMazo
        List<CartaMazo> cartasEnMazos = cartaMazoRepository.findByCarta(carta);

        // 3. Quitar relación
        cartasEnMazos.forEach(cartaMazo -> cartaMazo.setCarta(null));

        // 4. Guardar las relaciones modificadas
        cartaMazoRepository.saveAll(cartasEnMazos);

        // 5. Eliminar la carta
        cartaRepository.delete(carta);

        // 6. Retornar la carta eliminada
        return carta;
    }

}

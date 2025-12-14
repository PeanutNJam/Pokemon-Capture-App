package com.example.pokemonauth.pokemon;

import com.example.pokemonauth.portfolio.UserPokemonRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pokemon")
public class PokemonController {

    private final PokemonRepository pokemonRepo;
    private final UserPokemonRepository userPokemonRepo;

    public PokemonController(PokemonRepository pokemonRepo, UserPokemonRepository userPokemonRepo) {
        this.pokemonRepo = pokemonRepo;
        this.userPokemonRepo = userPokemonRepo;
    }

    // Names ONLY
    @GetMapping("/unowned")
    public List<String> unownedNames(Authentication auth) {
        UUID userId = UUID.fromString(auth.getName());
        var ownedIds = userPokemonRepo.findPokemonIdsByUserId(userId);
        return pokemonRepo.findAll().stream()
                .filter(p -> !ownedIds.contains(p.getId()))
                .map(PokemonEntity::getName)
                .toList();
    }
}
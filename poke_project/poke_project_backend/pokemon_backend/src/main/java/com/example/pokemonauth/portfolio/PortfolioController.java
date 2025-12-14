package com.example.pokemonauth.portfolio;

import com.example.pokemonauth.pokemon.PokemonRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final UserPokemonRepository userPokemonRepo;
    private final PokemonRepository pokemonRepo;

    public PortfolioController(UserPokemonRepository userPokemonRepo, PokemonRepository pokemonRepo) {
        this.userPokemonRepo = userPokemonRepo;
        this.pokemonRepo = pokemonRepo;
    }

    @GetMapping
    public List<PortfolioItem> get(Authentication auth) {
        UUID userId = UUID.fromString(auth.getName());
        var owned = userPokemonRepo.findByUserId(userId);

        return owned.stream().map(up -> {
            var p = pokemonRepo.findById(up.getPokemonId()).orElseThrow();
            return new PortfolioItem(
                    p.getId(), p.getName(), p.getHp(), p.getAttack(), p.getDefense(), p.getType(), up.getCapturedAt().toString()
            );
        }).toList();
    }

    // manual add (optional)
    @PostMapping("/{pokemonId}")
    public void add(Authentication auth, @PathVariable Integer pokemonId) {
        UUID userId = UUID.fromString(auth.getName());
        if (userPokemonRepo.existsByUserIdAndPokemonId(userId, pokemonId)) return;

        var up = new UserPokemonEntity();
        up.setId(UUID.randomUUID());
        up.setUserId(userId);
        up.setPokemonId(pokemonId);
        userPokemonRepo.save(up);
    }

    @DeleteMapping("/{pokemonId}")
    public void remove(Authentication auth, @PathVariable Integer pokemonId) {
        UUID userId = UUID.fromString(auth.getName());
        userPokemonRepo.deleteByUserIdAndPokemonId(userId, pokemonId);
    }

    public record PortfolioItem(Integer id, String name, int hp, int attack, int defense, String type, String capturedAt) {}
}

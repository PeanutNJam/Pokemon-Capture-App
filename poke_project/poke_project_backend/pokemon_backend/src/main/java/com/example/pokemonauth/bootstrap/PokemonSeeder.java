package com.example.pokemonauth.bootstrap;

import com.example.pokemonauth.pokemon.PokemonEntity;
import com.example.pokemonauth.pokemon.PokemonRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PokemonSeeder implements CommandLineRunner {

    private final PokemonRepository repo;

    public PokemonSeeder(PokemonRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) {
        // Don't call repo.count() here; table may not exist yet on first boot in Docker.
        try {
            // If table exists and has data, skip
            if (repo.existsByNameIgnoreCase("Bulbasaur")) return;
        } catch (Exception ignored) {
            // table might not exist yet; proceed to seed after schema init
        }

        repo.saveAll(List.of(
                p("Bulbasaur", 45, 49, 49, "Grass"),
                p("Charmander", 39, 52, 43, "Fire"),
                p("Squirtle", 44, 48, 65, "Water"),
                p("Pidgey", 40, 45, 40, "Normal"),
                p("Rattata", 30, 56, 35, "Normal"),
                p("Pikachu", 35, 55, 40, "Electric"),
                p("Jigglypuff", 115, 45, 20, "Normal"),
                p("Diglett", 10, 55, 25, "Ground"),
                p("Machop", 70, 80, 50, "Fighting"),
                p("Tentacool", 40, 40, 35, "Water"),
                p("Geodude", 40, 80, 100, "Rock"),
                p("Slowpoke", 90, 65, 65, "Water"),
                p("Magnemite", 25, 35, 70, "Electric"),
                p("Hitmonlee", 50, 120, 53, "Fighting"),
                p("Chansey", 250, 5, 5, "Normal"),
                p("Mr. Mime", 40, 45, 65, "Psychic")
        ));
    }

    private PokemonEntity p(String name, int hp, int atk, int def, String type) {
        PokemonEntity p = new PokemonEntity();
        p.setName(name);
        p.setHp(hp);
        p.setAttack(atk);
        p.setDefense(def);
        p.setType(type);
        return p;
    }
}


package com.example.pokemonauth.pokemon;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PokemonRepository extends JpaRepository<PokemonEntity, Integer> {

    @Query("SELECT p FROM PokemonEntity p ORDER BY function('random')")
    List<PokemonEntity> findRandom(PageRequest pageRequest);
}

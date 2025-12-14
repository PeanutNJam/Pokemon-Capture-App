package com.example.pokemonauth.portfolio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserPokemonRepository extends JpaRepository<UserPokemonEntity, UUID> {
    List<UserPokemonEntity> findByUserId(UUID userId);
    Optional<UserPokemonEntity> findByUserIdAndPokemonId(UUID userId, Integer pokemonId);
    boolean existsByUserIdAndPokemonId(UUID userId, Integer pokemonId);
    void deleteByUserIdAndPokemonId(UUID userId, Integer pokemonId);

    @Query("SELECT up.pokemonId FROM UserPokemonEntity up WHERE up.userId = ?1")
    List<Integer> findPokemonIdsByUserId(UUID userId);
}

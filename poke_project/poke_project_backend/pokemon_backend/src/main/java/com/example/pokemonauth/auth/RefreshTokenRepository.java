package com.example.pokemonauth.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, UUID> {
    Optional<RefreshTokenEntity> findByTokenHash(String tokenHash);
    long deleteByUserId(UUID userId);
    long deleteByExpiresAtBefore(Instant now);
}

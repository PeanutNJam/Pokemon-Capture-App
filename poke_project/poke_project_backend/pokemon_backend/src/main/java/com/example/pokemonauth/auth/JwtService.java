package com.example.pokemonauth.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    private final byte[] secret;
    private final int accessMinutes;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.accessMinutes}") int accessMinutes
    ) {
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.accessMinutes = accessMinutes;
    }

    public String issueAccessToken(UUID userId, String email, String trainerName) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(accessMinutes * 60L);

        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .claim("trainerName", trainerName)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(Keys.hmacShaKeyFor(secret))
                .compact();
    }

    public UUID verifyAndGetUserId(String token) {
        String sub = Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secret))
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        return UUID.fromString(sub);
    }
}

package com.example.pokemonauth.auth;

import com.example.pokemonauth.user.UserEntity;
import com.example.pokemonauth.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository users;
    private final RefreshTokenRepository refreshTokens;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    private final int refreshDays;

    public AuthService(
            UserRepository users,
            RefreshTokenRepository refreshTokens,
            JwtService jwtService,
            @Value("${app.jwt.refreshDays}") int refreshDays
    ) {
        this.users = users;
        this.refreshTokens = refreshTokens;
        this.jwtService = jwtService;
        this.refreshDays = refreshDays;
    }

    public AuthResult register(String email, String password, String trainerName) {
        if (users.existsByEmail(email)) throw new RuntimeException("EMAIL_EXISTS");

        UserEntity u = new UserEntity();
        u.setEmail(email.toLowerCase());
        u.setPasswordHash(encoder.encode(password));
        u.setTrainerName(trainerName);
        u = users.save(u);

        return issueTokens(u);
    }

    public AuthResult login(String email, String password) {
        UserEntity u = users.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new RuntimeException("INVALID_LOGIN"));

        if (!encoder.matches(password, u.getPasswordHash())) {
            throw new RuntimeException("INVALID_LOGIN");
        }
        return issueTokens(u);
    }

    public AuthResult refresh(String rawRefreshToken) {
        String hash = CryptoUtil.sha256Hex(rawRefreshToken);

        RefreshTokenEntity rt = refreshTokens.findByTokenHash(hash)
                .orElseThrow(() -> new RuntimeException("INVALID_REFRESH"));

        if (rt.getRevokedAt() != null || rt.getExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("INVALID_REFRESH");
        }

        UserEntity u = users.findById(rt.getUserId()).orElseThrow(() -> new RuntimeException("INVALID_REFRESH"));

        // rotate refresh token (recommended)
        rt.setRevokedAt(Instant.now());
        refreshTokens.save(rt);

        return issueTokens(u);
    }

    public void logout(String rawRefreshToken) {
        String hash = CryptoUtil.sha256Hex(rawRefreshToken);
        refreshTokens.findByTokenHash(hash).ifPresent(rt -> {
            rt.setRevokedAt(Instant.now());
            refreshTokens.save(rt);
        });
    }

    private AuthResult issueTokens(UserEntity u) {
        String access = jwtService.issueAccessToken(u.getId(), u.getEmail(), u.getTrainerName());

        String refresh = CryptoUtil.randomToken();
        String refreshHash = CryptoUtil.sha256Hex(refresh);

        RefreshTokenEntity rt = new RefreshTokenEntity();
        rt.setUserId(u.getId());
        rt.setTokenHash(refreshHash);
        rt.setExpiresAt(Instant.now().plusSeconds(refreshDays * 86400L));
        refreshTokens.save(rt);

        return new AuthResult(access, refresh, u.getId());
    }

    public record AuthResult(String accessToken, String refreshToken, UUID userId) {}
}

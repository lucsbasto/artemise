// Package config carrega a configuração do backend a partir de variáveis de
// ambiente. DATABASE_URL é obrigatória; o restante tem padrões seguros.
package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

// Config agrega todas as variáveis de ambiente lidas no boot.
type Config struct {
	DatabaseURL string
	Port        string
	AppEnv      string        // "dev" | "prod"
	CORSOrigin  string        // origem permitida no CORS (frontend)
	SessionTTL  time.Duration // tempo de vida da sessão

	Argon2Time    uint32
	Argon2Memory  uint32
	Argon2Threads uint8
	Argon2KeyLen  uint32
	Argon2SaltLen uint32
}

// IsProd indica se o ambiente é produção (cookie Secure, sem stack trace).
func (c Config) IsProd() bool { return c.AppEnv == "prod" }

// Load lê o ambiente e retorna a config validada. Erro se DATABASE_URL ausente.
func Load() (Config, error) {
	cfg := Config{
		DatabaseURL:   os.Getenv("DATABASE_URL"),
		Port:          getenv("PORT", "8080"),
		AppEnv:        getenv("APP_ENV", "dev"),
		CORSOrigin:    getenv("CORS_ORIGIN", "http://localhost:3000"),
		SessionTTL:    time.Duration(getenvInt("SESSION_TTL_H", 720)) * time.Hour,
		Argon2Time:    uint32(getenvInt("ARGON2_TIME", 1)),
		Argon2Memory:  uint32(getenvInt("ARGON2_MEMORY", 64*1024)),
		Argon2Threads: uint8(getenvInt("ARGON2_THREADS", 4)),
		Argon2KeyLen:  32,
		Argon2SaltLen: 16,
	}
	if cfg.DatabaseURL == "" {
		return Config{}, fmt.Errorf("config: DATABASE_URL é obrigatória")
	}
	return cfg, nil
}

func getenv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func getenvInt(key string, def int) int {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return def
}

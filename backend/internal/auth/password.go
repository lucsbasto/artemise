// Package auth implementa hashing de senha com argon2id e helpers de sessão.
package auth

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"

	"golang.org/x/crypto/argon2"
)

// Params controla o custo do argon2id. Valores vêm da config (env).
type Params struct {
	Time    uint32
	Memory  uint32
	Threads uint8
	KeyLen  uint32
	SaltLen uint32
}

// DefaultParams reflete os padrões recomendados (time=1, memory=64MB, threads=4).
var DefaultParams = Params{Time: 1, Memory: 64 * 1024, Threads: 4, KeyLen: 32, SaltLen: 16}

// ErrInvalidHash indica que o hash codificado não está no formato esperado.
var ErrInvalidHash = errors.New("auth: formato de hash inválido")

// HashPassword gera um hash argon2id codificado no formato PHC:
// $argon2id$v=19$m=65536,t=1,p=4$<salt_b64>$<hash_b64>
func HashPassword(plain string, p Params) (string, error) {
	salt := make([]byte, p.SaltLen)
	if _, err := rand.Read(salt); err != nil {
		return "", fmt.Errorf("auth: gerar salt: %w", err)
	}
	hash := argon2.IDKey([]byte(plain), salt, p.Time, p.Memory, p.Threads, p.KeyLen)
	b64 := base64.RawStdEncoding
	encoded := fmt.Sprintf(
		"$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version, p.Memory, p.Time, p.Threads,
		b64.EncodeToString(salt), b64.EncodeToString(hash),
	)
	return encoded, nil
}

// VerifyPassword recomputa o hash de plain com os parâmetros embutidos em
// encoded e compara em tempo constante.
func VerifyPassword(encoded, plain string) (bool, error) {
	parts := strings.Split(encoded, "$")
	// ["", "argon2id", "v=19", "m=...,t=...,p=...", salt, hash]
	if len(parts) != 6 || parts[1] != "argon2id" {
		return false, ErrInvalidHash
	}

	var version int
	if _, err := fmt.Sscanf(parts[2], "v=%d", &version); err != nil {
		return false, ErrInvalidHash
	}
	if version != argon2.Version {
		return false, ErrInvalidHash
	}

	var memory, time uint32
	var threads uint8
	if _, err := fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &memory, &time, &threads); err != nil {
		return false, ErrInvalidHash
	}

	b64 := base64.RawStdEncoding
	salt, err := b64.DecodeString(parts[4])
	if err != nil {
		return false, ErrInvalidHash
	}
	want, err := b64.DecodeString(parts[5])
	if err != nil {
		return false, ErrInvalidHash
	}

	got := argon2.IDKey([]byte(plain), salt, time, memory, threads, uint32(len(want)))
	return subtle.ConstantTimeCompare(got, want) == 1, nil
}

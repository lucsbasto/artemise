package auth

import "testing"

func TestHashVerifyRoundTrip(t *testing.T) {
	hash, err := HashPassword("senha123", DefaultParams)
	if err != nil {
		t.Fatalf("HashPassword: %v", err)
	}
	ok, err := VerifyPassword(hash, "senha123")
	if err != nil {
		t.Fatalf("VerifyPassword: %v", err)
	}
	if !ok {
		t.Fatal("esperava verificação verdadeira para a senha correta")
	}
}

func TestVerifyWrongPassword(t *testing.T) {
	hash, err := HashPassword("senha123", DefaultParams)
	if err != nil {
		t.Fatalf("HashPassword: %v", err)
	}
	ok, err := VerifyPassword(hash, "senha-errada")
	if err != nil {
		t.Fatalf("VerifyPassword: %v", err)
	}
	if ok {
		t.Fatal("esperava verificação falsa para a senha errada")
	}
}

func TestHashIsSaltedUniquely(t *testing.T) {
	h1, err := HashPassword("senha123", DefaultParams)
	if err != nil {
		t.Fatalf("HashPassword #1: %v", err)
	}
	h2, err := HashPassword("senha123", DefaultParams)
	if err != nil {
		t.Fatalf("HashPassword #2: %v", err)
	}
	if h1 == h2 {
		t.Fatal("hashes da mesma senha deveriam diferir (salt aleatório)")
	}
}

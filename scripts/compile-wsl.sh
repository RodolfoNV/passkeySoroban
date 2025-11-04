#!/usr/bin/env bash
set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Uso: $0 /mnt/c/Users/<tu-usuario>/OneDrive/Documentos/7mo semestre/Ciberseguridad/pagina/passkeySoroban/contract"
  exit 1
fi

ROOT="$1"

echo "==> Instalando rustup (si no existe) y configurando toolchain..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
rustup default stable
rustup target add wasm32-unknown-unknown

echo "==> Compilando contrato en: $ROOT"
cd "$ROOT"
cargo build --target wasm32-unknown-unknown --release

echo "==> Compilación completada. Artefacto WASM en: $ROOT/target/wasm32-unknown-unknown/release/"

# Desarrollo local — Soroban Passkey Demo

Este archivo explica cómo levantar el proyecto localmente para desarrollo.

Requisitos
- Node.js 18+
- Rust 1.75+ (solo si vas a compilar el contrato en `contract/`)
- (Opcional) WSL en Windows para usar `make`/`cargo` sin problemas

Arranque rápido (frontend)

1. Instalar dependencias:

```powershell
cd frontend
npm install
```

2. Arrancar en desarrollo (HTTP):

```powershell
npm run dev
# Abre: http://localhost:3000
```

3. Arrancar en desarrollo con HTTPS (recomendado para WebAuthn/Passkeys):

```powershell
npm run dev:https
# Acepta el certificado self-signed en el navegador
```

Notas sobre WebAuthn/Passkeys
- WebAuthn requiere HTTPS para funcionar en la mayoría de navegadores. Usar `npm run dev:https` en desarrollo.
- Si el navegador bloquea el certificado self-signed, añade una excepción manualmente.

Contrato Soroban (opcional)

```powershell
cd contract
# Si tienes make (WSL o Unix):
make build
# O con cargo:
cargo build --target wasm32-unknown-unknown --release
```

Problemas comunes
- Eliminar `.next` si hay errores EINVAL/`readlink`:

```powershell
cd frontend
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
```

Seguridad y auditoría de dependencias
- Ejecuta `npm audit` y `npm audit fix` si quieres corregir vulnerabilidades.

Contacto
- Autor: ver `README.md`

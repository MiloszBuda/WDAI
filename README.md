# Aplikacja sklepu internetowego (Full-Stack)

[Demo](https://wdai-plum.vercel.app/)
> Ze względu na korzystanie z darmowego planu na Render.com, pierwsze ładowanie produktów może potrwać około 30-50 sekund, kolejne są już szybkie.

## Funkcjonalności
* **Autentykacja i Autoryzacja:** Obsługa logowania i rejestracji przy użyciu JWT (Access & Refresh tokens) zapisywanych w bezpiecznych ciasteczkach (httpOnly).
* **System ról (RBAC):** Podział na zwykłych użytkowników i Administratorów z różnymi poziomami dostępu (chronione ścieżki na frontendzie i backendzie).
* **Koszyk i Zamówienia:** Zarządzanie globalnym stanem koszyka (Context API) oraz pełen cykl życia zamówienia (zmiana statusów przez Admina).
* **System opinii:** Użytkownicy mogą zostawiać recenzje i oceny produktów.
* **Responsywność:** Interfejs dopasowany do urządzeń mobilnych i desktopowych.

## Technologie
**Frontend**
* React 19 + Vite
* TypeScript
* React Router v6
* Ant Design (UI Components) + CSS
* Axios (z interceptorami do odświeżania tokenów)
  
**Backend**
* Node.js + Express
* TypeScript
* Prisma ORM
* PostgreSQL (w chmurze Neon.tech)
* JWT & Bcrypt (bezpieczeństwo)

## Konta testowe

Możliwość przetestowania, używając poniższych danych:

**Konto Administratora:**
* **Username:** `admin`
* **Hasło:** `admin123`

**Konto Użytkownika:**
* **Username:** `user`
* **Hasło:** `1234`

## Uruchomienie lokalne
Projekt składa się z dwóch części, naleźy je uruchomić w osobnych terminalach

**backend**
```bash
cd backend

# 1. Początkowa instalacja
npm install

# 2. Utworzenie pliku .env (jeśli nie istnieje)
# Potrzebne klucze:
# DATABASE_URL="file:./dev.db"
# ACCESS_TOKEN_SECRET="secret_access"
# REFRESH_TOKEN_SECRET="secret_refresh"

# 3. Migracja bazy danych
npx prisma migrate dev --name init

# 4. Wypełnienie bazy danymi testowymi (produkty + 2 konta (user, admin))
npx prisma db seed

# 5. Uruchomienie serwera (domyślnie port 3000)
npm run dev
```
**frontend**
```bash
cd frontend

# 1. Początkowa instalacja
npm install

# 2. Uruchomienie serwera (domyślnie port 5173)
npm run dev
```


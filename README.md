# Projekt WDAI

## Autor: Miłosz Buda

## Technologie
### Frontend
* **Framework:** React 18 (Vite)
* **Język:** TypeScript
* **UI Library:** Ant Design (antd)
* **Komunikacja z API:** Axios
* **Routing:** React Router DOM
### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Baza danych:** SQLite (plik `dev.db`)
* **ORM:** Prisma
* **Autoryzacja:** JWT (Access Token + Refresh Token)

## Setup
Projekt składa się z dwóch części, naleźy je uruchomić w osobnych terminalach
### backend
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
### frontend
```bash
cd frontend

# 1. Początkowa instalacja
npm install

# 2. Uruchomienie serwera (domyślnie port 5173)
npm run dev
```

## Funkcjonalności
### Każdy użytkownik
* Przeglądanie listy produktów z możliwością wyszukiwania.
* Szczegóły produktu wraz ze zdjęciem, opisem i średnią oceną.
* Rejestracja i logowanie użytkowników.
### Użytkownik zalogowany
* Koszyk: Dodawanie/usuwanie produktów, zmiana ilości, przeliczanie sumy.
* Zamówienia: Składanie zamówienia (Checkout), podgląd historii własnych zamówień i ich statusów.
* Opinie: Możliwość dodania opinii o produkcie tylko po jego zakupie. Możliwość edycji i usuwania własnych opinii.
* Automatyczne wylogowanie po wygaśnięciu sesji, odświeżanie tokenów w tle.
### Administrator
* Dostęp chroniony (wymagana rola `admin` w bazie danych).
* Zarządzanie Zamówieniami: Podgląd wszystkich zamówień w systemie, zmiana ich statusów (np. W trakcie -> Wysłane -> Zrealizowane).
* Moderacja Opinii: Możliwość usunięcia dowolnej opinii w serwisie.

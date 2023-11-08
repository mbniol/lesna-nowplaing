# Back-end do radiowęzła

## Jak zacząć?

### Potrzebny software

- Node.js
- npm

### Przejdź do folderu `/back-end` i zainstaluj paczki

Wpisz w konsolę `npm i`.

### Dodać danę do pliku `.env`

Tak wygląda wzorowy plik `.env`:

```
CLIENT_ID='idKlienta'
CLIENT_SECRET='sekretKlienta'
DB_HOST='localhost'
DB_USER='root'
DB_PASSWORD='maslo'
DB_NAME='lesna-radiowezel'
PORT=3000
```

### Jak uruchomić serwer?

Wpisz `node index.js` w konsoli.

## Praca z bazą danych

- [przykład podstawowy z dokumentacji express.js](https://expressjs.com/en/guide/database-integration.html#mysql)
- [biblioteka do mysql](https://github.com/mysqljs/mysql)
- [escape'owanie wartości](https://github.com/mysqljs/mysql#escaping-query-values)

## Framework

- [express.js](https://expressjs.com/)

# Booknotes-website
A project to let me get more experience in node express and postgreSql.
Users can give review and rate books by entering the ISBN code of the book through this web page. The software will automatically search for the data name and cover image, and the data will be stored in PostgreSQL data. Users can also modify and delete reviews, and edit existing Some reviews are sorted by time and rating.
## Installation
```console
$ npm install
```
## Database
Users need to configure it in their own postgresql. First, users need to modify the database information in the `index.js` file.
```js
const db = new pg.Client({
    user:'xxx',
    host:'xxx',
    password:'xxx',
    port:xxx,
    database:'xxx',
});
```
Then execute the following sql code in postgresql
```sql
CREATE TABLE notes
(
    id integer NOT NULL DEFAULT nextval('notes_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    published_date date NOT NULL,
    rate integer,
    note text COLLATE pg_catalog."default" NOT NULL,
    isbn text COLLATE pg_catalog."default",
    CONSTRAINT notes_pkey PRIMARY KEY (id),
    CONSTRAINT notes_rate_check CHECK (rate > 0 AND rate <= 10)
)
```
## Effect

#This is a repo for the coding challenge for Luxor : https://luxorlabs.notion.site/Applications-API-Challenge-52d019a2cebe46cf9623f578df9f3ef6

It was built using Typescript and Prisma and Postgres. There is a dockerfile to spint up some containers

To start you want you want to create a .env file - use .env.ex as a guideline

then run `npm install`

after that you can run `docker compose up` or use a local version of postgres

if you are having problems with the docker containers interacting - try just running the
node api locally and connecting through the docker postgres container

to do that after installing and having a postgres server up just run `npm run prisma:generate` then run `npm run prisma:migrate:dev`


you can run tests with `npm run test`



#Overview of challenge
I basically created two endpoints `/pokemon` and `/pokemons` 

`/pokemon` will retrieve a single pokemon depending on the query params supplied. only `id` and `name` will retrieve a pokemon. The server will call the pokemon graphql api if the data is not in our database and insert a new record and subsequently each time that resource gets accessed it will be retrieved from the database and the pokemon graphql calls will cease.

`/pokemons` is a paginated route where you can supply `page`, `size` and `first` as url queries. these three will paginate your results. `first` is the actual payload count that we retrieve from the pokemon graphql api and the other `page` and `size` paginate that payload. This route figures out what current pokemon are in our system and those that arent and it will ingest the ones we dont have in our database


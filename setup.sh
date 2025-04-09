#!/bin/bash

set -e

#git pull upstream master

npm install

npx prisma migrate dev --name init
npx prisma generate

npx prisma migrate reset --force

npm run seed
echo -e "\033[0;32mLa base de donnee est remplie avec un utilisateur par defaut \n email: test.user@example.com et mdp: password123\033[0m"

npm run dev
echo "c'est carre l'api est lancee"





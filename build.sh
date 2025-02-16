cd ./frontend
npm run build
pm2 start "bun start" --name fe
cd ../backend
pm2 start "bun dev" --name be
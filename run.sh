cd ./backend
pm2 start "bun dev" --name be
cd ../frontend
pm2 start "bun start" --name fe
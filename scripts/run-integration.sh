set -e

echo "Running integration test"
docker compose up -d

echo 'Waiting for database to ready...'

./scripts/wait-for-it.sh  "localhost:5432"  -- echo '🟢 - Database is ready!'

export DATABASE_URL="postgresql://postgres:123456@localhost:5432/postgres"
export NODE_ENV="test"

npx prisma migrate dev --name init
npx vitest
echo "Cleaning up..."
docker compose down

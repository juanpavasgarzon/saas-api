.PHONY: help build up down logs shell migrate migrate-revert lint test

IMAGE_NAME ?= saas-api
TAG        ?= latest

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ─── Production ───────────────────────────────────────────────────────────────
build: ## Build production Docker image
	docker build -t $(IMAGE_NAME):$(TAG) .

up: ## Start production stack (requires .env)
	docker compose --env-file .env up -d

down: ## Stop production stack
	docker compose down

logs: ## Tail application logs
	docker compose logs -f app

# ─── Development ──────────────────────────────────────────────────────────────
dev: ## Start development stack with hot reload
	docker compose -f docker-compose.dev.yml --env-file .env up

dev-down: ## Stop development stack
	docker compose -f docker-compose.dev.yml down

dev-logs: ## Tail development logs
	docker compose -f docker-compose.dev.yml logs -f app

# ─── Database ─────────────────────────────────────────────────────────────────
migrate: ## Run pending migrations inside running app container
	docker compose exec app node -e \
		"const {AppDataSource}=require('./dist/core/infrastructure/database/data-source'); \
		 AppDataSource.initialize().then(()=>AppDataSource.runMigrations()).then(()=>process.exit(0))"

migrate-revert: ## Revert last migration
	docker compose exec app node -e \
		"const {AppDataSource}=require('./dist/core/infrastructure/database/data-source'); \
		 AppDataSource.initialize().then(()=>AppDataSource.undoLastMigration()).then(()=>process.exit(0))"

shell: ## Open shell inside running app container
	docker compose exec app sh

# ─── Local dev (without Docker) ───────────────────────────────────────────────
lint: ## Run ESLint
	npm run lint

test: ## Run unit tests
	npm test

build-local: ## Build TypeScript locally
	npm run build

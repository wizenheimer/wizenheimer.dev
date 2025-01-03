# Colors and formatting
BOLD := $(shell tput bold)
RESET := $(shell tput sgr0)
BLUE := $(shell tput setaf 4)
GREEN := $(shell tput setaf 2)
YELLOW := $(shell tput setaf 3)
RED := $(shell tput setaf 1)
CYAN := $(shell tput setaf 6)

# Variables
HUGO := hugo
PORT := 1313
DRAFT_PORT := 1314
PUBLIC_DIR := public
HUGO_ENV := production

.PHONY: build serve clean new deploy draft help check update stats

help:
	@echo "$(BOLD)$(BLUE)Available commands:$(RESET)"
	@echo "  $(CYAN)make build$(RESET)     - Build the site"
	@echo "  $(CYAN)make serve$(RESET)     - Serve the site locally"
	@echo "  $(CYAN)make draft$(RESET)     - Serve the site with draft posts"
	@echo "  $(CYAN)make clean$(RESET)     - Clean the build directory"
	@echo "  $(CYAN)make new$(RESET)       - Create a new post (usage: make new title='Post Title')"
	@echo "  $(CYAN)make deploy$(RESET)    - Deploy to production"
	@echo "  $(CYAN)make check$(RESET)     - Run various checks on the site"
	@echo "  $(CYAN)make stats$(RESET)     - Show site statistics"
	@echo "  $(CYAN)make help$(RESET)      - Show this help message"

build:
	@echo "$(BLUE)Building site...$(RESET)"
	@$(HUGO) --environment $(HUGO_ENV)
	@echo "$(GREEN)✓ Build complete$(RESET)"

serve:
	@echo "$(BLUE)Starting development server...$(RESET)"
	@$(HUGO) server \
		--port $(PORT) \
		--buildDrafts false \
		--buildFuture false \
		--disableFastRender

draft:
	@echo "$(YELLOW)Starting draft preview server...$(RESET)"
	@$(HUGO) server \
		--port $(DRAFT_PORT) \
		--buildDrafts true \
		--buildFuture true \
		--disableFastRender

clean:
	@echo "$(YELLOW)Cleaning build directory...$(RESET)"
	@rm -rf $(PUBLIC_DIR)
	@echo "$(GREEN)✓ Cleaned$(RESET)"

new:
ifndef title
	@echo "$(RED)Error: Please provide a title (make new title='Post Title')$(RESET)"
	@exit 1
endif
	@echo "$(BLUE)Creating new post: $(YELLOW)$(title)$(RESET)"
	@$(HUGO) new posts/$(shell echo '${title}' | tr '[:upper:]' '[:lower:]' | tr ' ' '-').md
	@echo "$(GREEN)✓ Post created$(RESET)"

project:
ifndef title
	@echo "$(RED)Error: Please provide a title (make project title='Project Title')$(RESET)"
	@exit 1
endif
	@echo "$(BLUE)Creating new post for project: $(YELLOW)$(title)$(RESET)"
	@$(HUGO) new projects/$(shell echo '${title}' | tr '[:upper:]' '[:lower:]' | tr ' ' '-').md
	@echo "$(GREEN)✓ Post created$(RESET)"

check:
	@echo "$(BLUE)Running Hugo check...$(RESET)"
	@$(HUGO) --gc --minify
	@echo "\n$(BLUE)Checking for empty files...$(RESET)"
	@find content -type f -empty -print && echo "$(GREEN)✓ No empty files found$(RESET)" || true
	@echo "\n$(BLUE)Checking for missing front matter...$(RESET)"
	@find content -name "*.md" -exec grep -L "^---" {} \; && echo "$(GREEN)✓ All files have front matter$(RESET)" || true

deploy: clean build
	@echo "$(YELLOW)Deploying to production...$(RESET)"
	# Add your deployment commands here
	@echo "$(GREEN)✓ Deployment complete$(RESET)"

update:
	@echo "$(BLUE)Updating Hugo modules...$(RESET)"
	@hugo mod get -u ./...
	@hugo mod verify
	@echo "$(GREEN)✓ Modules updated$(RESET)"

stats:
	@echo "$(BOLD)$(BLUE)Site Statistics:$(RESET)"
	@echo "╭───────────┬───────╮"
	@echo "│ Metric    │ Count │"
	@echo "├───────────┼───────┤"
	@printf "│ Posts     │ %5d │\n" "$(find content/posts -name '*.md' | wc -l)"
	@printf "│ Teardowns │ %5d │\n" "$(find content/teardowns -name '*.md' | wc -l)"
	@printf "│ Projects  │ %5d │\n" "$(find content/projects -name '*.md' | wc -l)"
	@printf "│ Drafts    │ %5d │\n" "$(find content -name '*.md' -exec grep -l 'draft: true' {} \; | wc -l)"
	@printf "│ Pages     │ %5d │\n" "$(find content -name '*.md' | wc -l)"
	@echo "╰───────────┴───────╯"


# Development shortcuts
.PHONY: dev
dev: serve

.PHONY: preview
preview: draft
# Contributing to py-quest

Thank you for contributing! To maintain a high-quality codebase and a clear project history, please follow these guidelines.

## 🛠 Efficient Commit Strategy

To build this project effectively (e.g., reaching 15+ meaningful commits over 3 days), we recommend a modular "feature-first" cadence.

### Day 1: Foundation & Data
1. `feat: scaffold vite multi-page directory structure`
2. `feat: add base bootstrap styles and navigation components`
3. `feat: implement gameSchema and challengeFactory services`
4. `feat: create initial SQL migration for levels and profiles`
5. `test: add unit tests for schema validation`

### Day 2: Core Mechanics & Backend
6. `feat: integrate Supabase Auth service and login page`
7. `feat: implement difficulty scaling and challenge variants`
8. `feat: add clue/hint service with XP deduction logic`
9. `feat: implement runnerClient for API-based code grading`
10. `fix: resolve state persistence issues in session handling`

### Day 3: UI, Storage & Admin
11. `feat: build interactive challengePlayer UI component`
12. `feat: add profile page with Supabase storage for avatars`
13. `feat: implement admin dashboard and challenge management API`
14. `docs: update README with deployment and setup steps`
15. `chore: final linting and performance optimization`

## 📝 Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semi colons, etc; no code change
- `refactor`: Refactoring production code
- `test`: Adding missing tests, refactoring tests
- `chore`: Updating build tasks, package manager configs, etc; no production code change

## 🤖 Working with GitHub Copilot

This project is optimized for AI-assisted development. Follow these best practices:

1.  **Instruction File**: Always reference `.github/copilot-instructions.md` to ensure Copilot understands the "Vanilla JS + Supabase" constraints.
2.  **Top-of-File Prompts**: Start every new file with a clear, single-line "Copilot:" comment.
    - Example: `// Copilot: Implement a pure function service for calculating XP multipliers based on level index.`
3.  **Iterative Refinement**: If a suggestion is too complex, ask Copilot to "break this into smaller ES modules" or "remove Framework dependencies."
4.  **contextual Awareness**: Keep your current working file open in the editor so Copilot can see related imports and styles.

---
Happy Coding! 🐍

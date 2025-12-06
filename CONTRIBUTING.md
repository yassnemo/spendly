# Contributing to Spendly

Thanks for your interest in contributing! This document outlines how to get started.

## Development Setup

1. Fork the repo and clone it locally
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your credentials
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/          # Next.js app router pages
├── components/   # React components organized by feature
├── lib/          # Utilities, API clients, helpers
├── store/        # Zustand state management
└── types/        # TypeScript type definitions
```

## Making Changes

1. Create a branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes. Keep commits focused and atomic.

3. Test your changes locally. Make sure:
   - The app builds without errors (`npm run build`)
   - No TypeScript errors
   - UI looks good on mobile and desktop

4. Push and open a PR against `main`

## Commit Messages

Use clear, descriptive commit messages:

- `fix: resolve login redirect issue`
- `feat: add expense export to CSV`
- `docs: update README with new env vars`
- `refactor: simplify budget calculation logic`

## Pull Request Guidelines

- Keep PRs small and focused on a single change
- Include a clear description of what changed and why
- Add screenshots for UI changes
- Link any related issues

## Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Use Tailwind CSS for styling
- Prefer functional components with hooks

## Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS info
- Screenshots if applicable

## Feature Requests

Open an issue describing:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you considered

## Questions?

Feel free to open an issue or start a discussion. We're happy to help!

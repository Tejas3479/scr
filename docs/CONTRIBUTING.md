# Contributing Guidelines

## Development Setup

1. Fork the repository
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Run tests: `npm test` or `pytest`
6. Commit your changes: `git commit -am 'Add feature'`
7. Push to branch: `git push origin feature/your-feature`
8. Submit a pull request

## Code Style

### JavaScript/TypeScript
- Use ESLint and Prettier
- Follow Airbnb style guide
- Use async/await over callbacks

### Python
- Follow PEP 8
- Use Black for formatting
- Maximum line length: 100 characters

## Testing

- Write unit tests for new features
- Aim for >80% code coverage
- Run tests before committing

## Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance

## Pull Request Process

1. Update documentation
2. Add tests if applicable
3. Ensure all tests pass
4. Get code review approval
5. Merge after CI/CD passes



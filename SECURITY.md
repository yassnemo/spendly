# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Spendly, please report it responsibly.

**Do not open a public issue.** Instead, email the maintainers directly or use GitHub's private vulnerability reporting feature.

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)

We'll acknowledge your report within 48 hours and work with you to understand and address the issue.

## Scope

This policy applies to:
- The Spendly web application
- Official deployment configurations
- Authentication and data handling code

## Best Practices for Users

- Never share your API keys or `.env` file
- Use strong passwords for your account
- Keep your browser and dependencies updated
- Report suspicious behavior immediately

## Security Measures

Spendly implements several security measures:

- Firebase Authentication for secure login
- Environment variables for all sensitive credentials
- No credentials stored in the codebase
- HTTPS enforced in production
- Input validation and sanitization

## Acknowledgments

We appreciate security researchers who help keep Spendly safe. Contributors who report valid vulnerabilities will be acknowledged (with permission) in our release notes.

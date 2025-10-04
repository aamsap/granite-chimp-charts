# Contributing to Chimp Chart

Thank you for your interest in contributing to Chimp Chart! We welcome contributions from the community and appreciate your help in making this project better.

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** - Make sure the bug hasn't already been reported
2. **Create a new issue** with the following information:
   - Clear, descriptive title
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node.js version)

### Suggesting Features

1. **Check existing feature requests** - Avoid duplicates
2. **Create a new issue** with:
   - Clear feature description
   - Use case and motivation
   - Potential implementation approach (if you have ideas)

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following our coding standards
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to your fork**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

## 📋 Development Setup

### Prerequisites
- Node.js 18.18.0 or higher
- npm 9.0.0 or higher
- Git

### Setup Instructions

1. **Clone your fork**
```bash
git clone https://github.com/your-username/granite-chimp-charts.git
cd granite-chimp-charts
```

2. **Install dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

3. **Setup environment variables**
```bash
# Frontend
cp env.example .env

# Backend
cd backend
cp env.example .env
cd ..
```

4. **Start development servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## 🎯 Coding Standards

### Frontend (React/TypeScript)

- **TypeScript**: Use TypeScript for all new code
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes
- **Naming**: Use PascalCase for components, camelCase for functions
- **Imports**: Use absolute imports with `@/` alias
- **Props**: Define proper TypeScript interfaces

```typescript
// Good example
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, size, onClick, children }) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Backend (Node.js/Express)

- **ES Modules**: Use ES6 import/export syntax
- **Error Handling**: Always handle errors properly
- **Validation**: Use Joi for input validation
- **Async/Await**: Prefer async/await over callbacks
- **Naming**: Use camelCase for functions and variables

```javascript
// Good example
export async function validateFile(filePath) {
  try {
    const stats = await fs.stat(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      throw new Error('File too large');
    }
    return { isValid: true, size: stats.size };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
}
```

### Git Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(upload): add drag and drop file upload
fix(api): resolve file validation error
docs(readme): update installation instructions
```

## 🧪 Testing

### Frontend Testing
```bash
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

### Manual Testing Checklist

- [ ] File upload works with CSV/Excel files
- [ ] File validation catches invalid files
- [ ] Analysis completes successfully
- [ ] Dashboard generation works
- [ ] PDF export functions properly
- [ ] Error handling displays appropriate messages
- [ ] Responsive design works on mobile

## 📝 Documentation

### Code Documentation
- Add JSDoc comments for functions and classes
- Include parameter types and return values
- Provide usage examples for complex functions

### README Updates
- Update README.md for new features
- Add setup instructions for new dependencies
- Update API documentation for new endpoints

## 🚀 Pull Request Process

1. **Ensure tests pass**: Run `npm test` before submitting
2. **Update documentation**: Update README and code comments
3. **Write clear PR description**: Explain what changes you made and why
4. **Link issues**: Reference any related issues
5. **Request review**: Tag relevant team members

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] Screenshots attached (if UI changes)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🏷️ Release Process

1. **Version bump**: Update version in package.json
2. **Changelog**: Update CHANGELOG.md
3. **Tag release**: Create git tag
4. **Deploy**: Deploy to production

## 📞 Getting Help

- **Discord**: Join our community server
- **GitHub Issues**: For bug reports and feature requests
- **Email**: hello@chimpchart.com
- **Documentation**: Check SETUP.md for detailed instructions

## 📄 License

By contributing to Chimp Chart, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Chimp Chart! 🎉

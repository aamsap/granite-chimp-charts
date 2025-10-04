# Changelog

All notable changes to Chimp Chart will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with React + TypeScript frontend
- Node.js + Express backend API
- File upload and validation system
- Granite AI integration for data analysis
- Dashboard generation with automatic layout
- PDF export functionality
- Free and Pro user plan features
- Comprehensive documentation

### Changed
- Removed all Lovable traces from the project
- Updated project branding to Chimp Chart
- Improved error handling and user feedback

### Fixed
- File validation edge cases
- PDF generation performance
- Mobile responsive design issues

## [1.0.0] - 2024-01-05

### Added
- 🎉 **Initial Release**
- **Frontend Features**:
  - Modern React 18 application with TypeScript
  - Beautiful UI with Tailwind CSS and Shadcn/ui components
  - Responsive design for all devices
  - Dark/light mode support
  - File upload with drag & drop interface
  - Real-time analysis progress indicators
  - Dashboard preview and PDF download

- **Backend Features**:
  - RESTful API with Express.js
  - File upload handling with Multer
  - CSV/Excel file parsing and validation
  - Granite AI integration for data analysis
  - Automatic KPI suggestions
  - Visualization recommendations
  - Dashboard generation with custom layouts
  - PDF generation with Puppeteer
  - Plan-based feature access control

- **Core Workflow**:
  - Upload CSV/Excel files (up to 10MB)
  - Automatic data validation and structure analysis
  - AI-powered KPI identification and suggestions
  - Smart visualization type recommendations
  - Professional dashboard generation
  - High-quality PDF export

- **User Plans**:
  - **Free Plan**: 1000 rows, basic features, standard PDF
  - **Pro Plan**: Unlimited rows, custom titles, multiple pages, themes, priority support

- **Security & Performance**:
  - Rate limiting (100 requests per 15 minutes)
  - File type and size validation
  - CORS protection
  - Input validation with Joi schemas
  - Security headers with Helmet
  - Optimized build process

- **Documentation**:
  - Comprehensive README with setup instructions
  - API documentation
  - Contributing guidelines
  - Setup guide for development
  - Environment configuration examples

### Technical Details
- **Frontend**: React 18.3.1, TypeScript, Tailwind CSS, Shadcn/ui, React Router, Recharts
- **Backend**: Node.js, Express.js, Multer, Puppeteer, Joi, CORS, Helmet
- **Build Tools**: Vite, ESLint, TypeScript compiler
- **Package Management**: npm with lock files
- **Version Control**: Git with comprehensive .gitignore

### Known Issues
- Node.js version warnings (requires 18.18.0+, works with 18.15.0)
- 2 moderate security vulnerabilities in dependencies (can be fixed with `npm audit fix`)

---

## Version History

- **v1.0.0** - Initial release with full feature set
- **v0.0.0** - Development phase (Lovable-based prototype)

## Migration Guide

### From Lovable Version
If you're migrating from the Lovable-based version:

1. **Remove Lovable dependencies**:
   ```bash
   npm uninstall lovable-tagger
   ```

2. **Update environment variables**:
   - Copy `env.example` to `.env`
   - Set `VITE_API_URL=http://localhost:3001/api`

3. **Install new dependencies**:
   ```bash
   npm install
   cd backend && npm install
   ```

4. **Start the new backend**:
   ```bash
   cd backend && npm run dev
   ```

5. **Start the frontend**:
   ```bash
   npm run dev
   ```

## Support

For questions about this release:
- Check the [README.md](README.md) for setup instructions
- Review [SETUP.md](SETUP.md) for detailed configuration
- Open an issue on GitHub for bugs or feature requests
- Contact us at hello@chimpchart.com

---

**Chimp Chart Team** - *Making data visualization accessible to everyone* 🐵📊

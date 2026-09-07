# Contributing to synaptiCITY

Thank you for your interest in contributing to synaptiCITY! This document provides guidelines and instructions for contributing to the project.

## 🎯 Ways to Contribute

### 1. Report Bugs 🐛

Found a bug? Help us fix it!

**Before submitting:**
- Check if the issue already exists
- Try to reproduce it in the latest version
- Gather relevant information (browser, OS, steps to reproduce)

**Submit via:**
- GitHub Issues: https://github.com/sorathiyalaksh37-lang/synaptiCITY/issues
- Include: Screenshots, console errors, reproduction steps

### 2. Suggest Features 💡

Have an idea for improvement?

**Good feature suggestions:**
- Solve a real problem or limitation
- Align with synaptiCITY's educational mission
- Are technically feasible
- Include use cases and examples

**Submit via:**
- GitHub Discussions: https://github.com/sorathiyalaksh37-lang/synaptiCITY/discussions
- Describe the problem, proposed solution, and benefits

### 3. Improve Documentation 📚

Documentation is crucial for learning!

**Help needed with:**
- Fixing typos and grammar
- Clarifying confusing explanations
- Adding examples and tutorials
- Translating to other languages
- Creating video tutorials

### 4. Submit Code 💻

Ready to code? Awesome!

**Good first issues:**
- Look for "good first issue" label on GitHub
- UI improvements and polish
- Test coverage additions
- Performance optimizations
- Accessibility improvements

---

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18+ and npm
- **Git** for version control
- **Code editor** (VS Code recommended)

### Local Development

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/synaptiCITY.git
cd synaptiCITY

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open http://localhost:5173
```

### Project Structure

```
synaptiCITY/
├── src/
│   ├── components/          # React components
│   │   ├── NeuralGrid.tsx   # Main visualization
│   │   ├── TeachInterface.tsx
│   │   └── ...
│   ├── lib/                 # Core logic
│   │   ├── NeuralNetwork.ts # Hebbian learning
│   │   ├── LearningRules.ts # Different rules
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── styles/              # CSS styles
│   └── types.ts             # TypeScript types
├── public/                  # Static assets
├── server/                  # Backend API (optional)
└── tests/                   # Test files (coming soon)
```

### Key Technologies

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, custom CSS
- **State**: React hooks (no external state library)
- **Build**: Vite (fast, modern)
- **Linting**: oxlint
- **Deployment**: Vercel (automatic)

---

## 📝 Code Guidelines

### TypeScript

```typescript
// ✅ Good: Explicit types
interface NetworkState {
  weights: number[][];
  vocabulary: string[];
  learningRate: number;
}

function teach(input: string, output: string, repetitions: number): void {
  // ...
}

// ❌ Bad: Implicit any types
function teach(input, output, repetitions) {
  // ...
}
```

### React Components

```typescript
// ✅ Good: Functional components with proper typing
interface Props {
  value: number;
  onChange: (value: number) => void;
}

export const Component: React.FC<Props> = ({ value, onChange }) => {
  return <div>...</div>;
};

// ❌ Bad: Class components, missing types
export class Component extends React.Component {
  // ...
}
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `NeuralGrid`, `TeachInterface` |
| Functions | camelCase | `calculateWeight`, `handleClick` |
| Constants | UPPER_SNAKE_CASE | `MAX_NODES`, `DEFAULT_RATE` |
| Files | PascalCase (components) | `NeuralGrid.tsx` |
| Files | camelCase (utilities) | `storage.ts`, `analytics.ts` |

### Code Style

```typescript
// ✅ Good: Clear, readable
const handleTeach = (input: string, output: string) => {
  const result = network.teach(input, output, repetitions);
  setFeedback(result);
  trackTeach(input, output);
};

// ❌ Bad: Unclear, side effects
const h = (i, o) => {
  let r = network.teach(i, o, repetitions);
  setFeedback(r);
  console.log('taught'); // Don't use console.log in production
};
```

### Comments

```typescript
// ✅ Good: Explain WHY, not WHAT
// Normalize weights to prevent runaway growth (Oja's Rule)
const normalized = weight / (1 + Math.abs(weight));

// ❌ Bad: Obvious comments
// Divide weight by 1 plus absolute value of weight
const normalized = weight / (1 + Math.abs(weight));
```

---

## 🧪 Testing

### Manual Testing

Before submitting a PR:

1. **Test the feature/fix thoroughly**
   - Try different inputs
   - Test edge cases
   - Verify on different screen sizes

2. **Check existing features**
   - Ensure nothing broke
   - Test related functionality
   - Verify the tutorial still works

3. **Test in multiple browsers**
   - Chrome/Edge/Brave
   - Safari (if possible)
   - Firefox
   - Mobile browsers

### Automated Testing (Coming Soon)

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run linter
npm run lint
```

---

## 🔄 Pull Request Process

### 1. Create a Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
# or: git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the code guidelines above
- Test thoroughly
- Commit frequently with clear messages

### 3. Commit Guidelines

```bash
# Format: <type>: <subject>

# Types:
# feat: New feature
# fix: Bug fix
# docs: Documentation changes
# style: Code style (formatting, no logic change)
# refactor: Code refactoring
# perf: Performance improvements
# test: Adding tests
# chore: Build/tooling changes

# Examples:
git commit -m "feat: add pinch-to-zoom gesture support"
git commit -m "fix: resolve weight matrix NaN issue"
git commit -m "docs: clarify Hebbian learning explanation"
```

### 4. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Then create PR on GitHub
```

### 5. PR Template

```markdown
## Description
Brief description of what this PR does and why.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] Tested in multiple browsers
- [ ] No existing features broken

## Screenshots (if applicable)
Add screenshots or GIFs showing the change.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if needed)
- [ ] No console errors
```

### 6. Code Review

- Be open to feedback
- Respond promptly to review comments
- Make requested changes
- Ask questions if unclear

### 7. Merge

Once approved:
- PR will be merged by maintainers
- Your changes will auto-deploy to production!

---

## 🎨 Design Guidelines

### Synaptic Bioluminescence Design System

**Color Palette:**
```css
/* Primary (Cyan) */
--primary: #38bdf8;
--primary-container: #004965;

/* Secondary (Indigo) */
--secondary: #bdc2ff;
--secondary-container: #2f3aa3;

/* Tertiary (Violet) */
--tertiary: #f2b8ff;
--tertiary-container: #6a2b80;

/* Surfaces (Dark) */
--surface: #10131c;
--surface-container: #1c1f29;
```

**Typography:**
- Display: Space Grotesk (700)
- Body: Geist (400, 500, 600)
- Code: JetBrains Mono (400, 500)

**Spacing:**
- Base: 8px rhythm
- Use: 0.5rem, 1rem, 1.5rem, 2rem, 3rem

**Border Radius:**
- Small: 0.25rem (4px)
- Medium: 0.5rem (8px)
- Large: 0.75rem (12px)

### UI Patterns

```tsx
// ✅ Good: Consistent with design system
<button className="bg-primary text-on-primary hover:bg-primary-container 
                   px-4 py-2 rounded-lg font-semibold transition-colors">
  Submit
</button>

// ❌ Bad: Arbitrary colors and spacing
<button style={{ background: '#00a8ff', padding: '7px 13px' }}>
  Submit
</button>
```

---

## ♿ Accessibility

### Requirements

- **Keyboard navigation**: All interactive elements must be keyboard accessible
- **ARIA labels**: Use semantic HTML and ARIA where needed
- **Color contrast**: Minimum 4.5:1 for text
- **Focus indicators**: Visible focus states for all interactive elements
- **Screen reader support**: Test with screen readers

### Examples

```tsx
// ✅ Good: Accessible button
<button
  aria-label="Teach DOG to ANIMAL association"
  onClick={handleTeach}
  disabled={isTeaching}
>
  Teach
</button>

// ❌ Bad: Non-semantic, not accessible
<div onClick={handleTeach}>
  Teach
</div>
```

---

## 📊 Analytics & Privacy

### Adding Analytics Events

```typescript
import { analytics } from '../lib/analytics';

// Track feature usage
analytics.trackEvent({
  category: 'Network',
  action: 'topology_changed',
  label: topologyType
});

// Use convenience methods
import { trackTeach, trackRecall } from '../lib/analytics';
trackTeach(input, output);
trackRecall(input, output, success);
```

### Privacy First

- Never track personal data
- Make analytics opt-in
- Explain what's collected
- Provide easy opt-out

---

## 🚀 Deployment

### Automatic Deployment

Every push to `main` triggers:
1. Linting and build check
2. Deployment to Vercel
3. URL: https://synapti-city.vercel.app

### Preview Deployments

Pull requests get preview URLs:
- Test before merging
- Share with reviewers
- Automatic on every PR commit

---

## 🎓 Learning Resources

### Hebbian Learning
- [Hebb's Rule Explained](https://en.wikipedia.org/wiki/Hebbian_theory)
- [Synaptic Plasticity](https://www.ncbi.nlm.nih.gov/books/NBK10878/)

### React & TypeScript
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

### Neural Networks
- [3Blue1Brown: Neural Networks](https://www.3blue1brown.com/topics/neural-networks)
- [Dragon Hatchling Paper](https://arxiv.org/abs/2509.26507)

---

## 💬 Communication

### GitHub Discussions

For questions, ideas, and general discussion:
https://github.com/sorathiyalaksh37-lang/synaptiCITY/discussions

### GitHub Issues

For bug reports and feature requests:
https://github.com/sorathiyalaksh37-lang/synaptiCITY/issues

### Pull Requests

For code contributions:
https://github.com/sorathiyalaksh37-lang/synaptiCITY/pulls

---

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism gracefully
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal attacks
- Publishing others' private information
- Unprofessional conduct

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report violations to: [your-email@domain.com]

---

## 🏆 Recognition

Contributors will be:
- Added to the README credits
- Mentioned in release notes
- Invited to the contributors team
- Awarded GitHub badges

---

## ❓ Questions?

Need help getting started?

- Read the [README.md](./README.md)
- Check the [FAQ.md](./FAQ.md)
- Join [GitHub Discussions](https://github.com/sorathiyalaksh37-lang/synaptiCITY/discussions)
- Open an issue if stuck

---

**Thank you for contributing to synaptiCITY!** 🧠✨

Every contribution, big or small, helps make neural networks more accessible to learners worldwide.

---

*Last Updated: September 4, 2026*

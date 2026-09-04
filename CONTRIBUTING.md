# Contributing to synaptiCITY

Thank you for your interest in contributing to synaptiCITY! This project was built for the Pathway Track educational competition.

## 📋 Contribution Guidelines

### During Competition Period

This project is currently submitted for evaluation in the Pathway Track competition. During this period:

- ❌ No external contributions accepted
- ✅ Bug reports welcome (open an issue)
- ✅ Feature suggestions welcome (open an issue)
- ✅ Questions and discussions encouraged

### After Competition Period

After the competition evaluation is complete, we'll open up contributions! Areas where help would be appreciated:

1. **Additional Vocabulary**: Expand beyond 6 words
2. **More Experiments**: New interference patterns to demonstrate
3. **Translations**: Make synaptiCITY multilingual
4. **Accessibility**: Enhance screen reader support
5. **Mobile UX**: Improve touch interactions
6. **Documentation**: Tutorial videos, blog posts
7. **Test Questions**: Expand the Sixty-Second Test

## 🛠️ Development Setup

```bash
# Clone the repository
git clone https://github.com/sorathiyalaksh37-lang/synaptiCITY.git
cd synaptiCITY

# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

## 📝 Code Style

We use:
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting (recommended)
- **Tailwind CSS** for styling

Before committing:
```bash
npm run lint
```

## 🧪 Testing Checklist

When making changes, verify:

- [ ] All three tabs work (Simulation, BDH/BDH-CQ, Test)
- [ ] Neural network visualization updates correctly
- [ ] Teaching and recall functions work
- [ ] Weight matrix reflects changes
- [ ] No console errors or warnings
- [ ] TypeScript compiles without errors
- [ ] Responsive on mobile devices
- [ ] Keyboard navigation works
- [ ] No accessibility regressions

## 📬 Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Accessibility enhancement

## Testing
How did you test this?

## Screenshots (if applicable)
Add screenshots for UI changes
```

## 🐛 Bug Reports

Use the GitHub issue tracker. Include:

1. **Expected behavior**
2. **Actual behavior**
3. **Steps to reproduce**
4. **Browser and OS**
5. **Screenshots or console errors**

## 💡 Feature Requests

We're interested in:
- Educational improvements
- Better visualizations
- New demonstrations of synaptic plasticity
- Connections to other AI architectures
- Accessibility enhancements

## 🎓 Educational Focus

Remember: synaptiCITY is an **educational tool**. All contributions should:

- Prioritize clarity over complexity
- Make abstract concepts concrete
- Maintain scientific accuracy
- Be accessible to beginners
- Connect toy models to real research

## 📚 Resources for Contributors

### Understanding the Codebase

- `src/lib/NeuralNetwork.ts`: Core Hebbian learning implementation
- `src/components/NeuralGrid.tsx`: Visualization logic
- `src/components/BDHModule.tsx`: Educational content about BDH/BDH-CQ
- `src/App.tsx`: Main application structure

### Key Concepts

1. **Hebbian Learning**: Δw = η × aᵢ × aⱼ
2. **Weight Matrix**: Stores all learned associations
3. **Interference**: Competing associations weaken each other
4. **Synaptic Plasticity**: Basis for neural memory

### Related Reading

- Dragon Hatchling (BDH) paper (2025)
- BDH-CQ Technical Report (2026)
- Hebb's "The Organization of Behavior" (1949)
- "From Attention to Synapses" paper

## 🤝 Code of Conduct

Be respectful, inclusive, and constructive. We're all here to learn and build something educational together.

## 📧 Questions?

Open a GitHub issue with the "question" label, and we'll help!

---

**Thank you for contributing to making synaptic plasticity more understandable!** 🧠✨

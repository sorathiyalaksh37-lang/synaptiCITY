# Frequently Asked Questions (FAQ)

## General Questions

### What is synaptiCITY?

synaptiCITY is an interactive educational platform that demonstrates how neural networks learn and remember through synaptic plasticity. It's designed to help users understand the fundamental concepts of Hebbian learning, memory formation, and brain-inspired AI through hands-on experimentation.

### Is this a real brain simulation?

No, synaptiCITY is an educational toy model that demonstrates core principles. Real brains have billions of neurons and complex biochemical processes. Our model uses 6 words and simple mathematical rules to make the concepts accessible and visual.

### Do I need programming knowledge to use synaptiCITY?

Not at all! The interactive interface is designed for learners at all levels. You can:
- Beginners: Use the guided tour and experiment with teaching/recall
- Intermediate: Explore different learning rules and network topologies
- Advanced: Inspect the weight matrices and export data for analysis

### Is synaptiCITY free to use?

Yes! synaptiCITY is completely free and open-source under the MIT License. You can use it for education, research, or personal learning without any cost.

---

## Technical Questions

### How does Hebbian learning work?

Hebbian learning follows the principle: "**Neurons that fire together, wire together.**"

In mathematical terms:
```
Δw = η × aᵢ × aⱼ
```

Where:
- `Δw` = change in connection weight
- `η` (eta) = learning rate
- `aᵢ` = activation of input neuron
- `aⱼ` = activation of output neuron

When you teach DOG → ANIMAL, both neurons activate together, and their connection strengthens.

### What's the difference between Hebbian, STDP, BCM, and Oja's Rule?

| Rule | Focus | Key Feature |
|------|-------|-------------|
| **Hebbian** | Classic correlation | Simple: Δw = η × aᵢ × aⱼ |
| **STDP** | Timing-dependent | Considers spike timing |
| **BCM** | Sliding threshold | Prevents runaway weights |
| **Oja's Rule** | Normalized | Keeps weights bounded |

Try each in the "Advanced Tools" tab to see how they behave differently!

### Why do weights sometimes decrease?

This is **synaptic decay** (forgetting). In real brains, unused connections gradually weaken. You can toggle this feature in the Learning Rules selector.

With forgetting enabled:
- Used connections strengthen (through teaching)
- Unused connections gradually decay
- This creates realistic memory interference

### What's the "learning rate"?

The learning rate (η) controls **how fast** the network learns:

- **Low rate (0.05)**: Slow, gradual learning - requires many repetitions
- **Medium rate (0.1)**: Balanced - our default
- **High rate (0.3)**: Fast learning - can overwrite quickly

Try different values in the Control Panel to see the effect!

### Why does the network sometimes recall the wrong word?

This demonstrates **memory interference**! When you teach:
1. DOG → ANIMAL (strong connection)
2. DOG → PET (competing connection)

The network has two paths from DOG. It recalls the **stronger** connection. This is similar to how we can confuse related memories in our brains.

---

## Features & Usage

### How do I install synaptiCITY as an app?

**Desktop (Chrome/Edge/Brave):**
1. Visit https://synapti-city.vercel.app
2. Look for install icon (⊕) in address bar
3. Click "Install synaptiCITY"

**Mobile (Android):**
1. Open in Chrome
2. Menu (⋮) → "Add to Home Screen"

**Mobile (iOS/Safari):**
1. Open in Safari
2. Share button (□↑) → "Add to Home Screen"

Once installed, it works offline!

### What keyboard shortcuts are available?

Press `?` to see all shortcuts, but here are the essentials:

| Key | Action |
|-----|--------|
| `T` | Teach current association |
| `R` | Recall from selected input |
| `Shift+R` | Reset network |
| `D` | Toggle debug panel |
| `G` | Switch to graph view |
| `H` | Switch to heatmap view |
| `Ctrl+[` / `Ctrl+]` | Navigate tabs |

### Can I export my network?

Yes! In the "Quick Tools" section:
- **Export JSON**: Full network state (weights, vocabulary, settings)
- **Export CSV**: Weight matrix as spreadsheet
- **Export PNG**: Screenshot of current visualization

### Can I import a network?

Yes! Use the import button in "Quick Tools" to load a previously exported JSON file. This is great for:
- Saving interesting network states
- Sharing networks with classmates
- Comparing before/after training

### Does it work offline?

Yes! After your first visit:
- All core features work offline
- Network simulation runs locally
- Visualizations and teaching/recall work
- Community features require internet

### How do I share my network?

Go to the "Community" tab → "Share Network":
1. **Share URL**: Generate a shareable link with your network state
2. **Screenshot**: Export as PNG image
3. **Social**: Share directly to Twitter, Facebook, LinkedIn
4. **Embed**: Get HTML code to embed in websites

---

## Learning & Education

### What should I learn first?

Follow this learning path:

1. **Complete the Tutorial** (first visit)
   - Learn the UI basics
   - Teach your first association
   - Test recall

2. **Follow the Experiment Stages** (left sidebar)
   - Stage 1: First connection (DOG → ANIMAL)
   - Stage 2: Strengthen it (repeat teaching)
   - Stage 3: Recall (test the network)
   - Stage 4: The fork (teach DOG → PET)
   - Stage 5: Competing paths (see interference)

3. **Explore Features**
   - Try different learning rules
   - Adjust the learning rate
   - Enable/disable forgetting
   - Switch between graph and heatmap views

4. **Advanced Concepts**
   - 3D visualization
   - Multi-layer networks
   - Attention mechanisms
   - BDH bridge to research

### What's the 60-Second Test?

It's a quick quiz to check understanding! After experimenting, take the test to verify you've grasped:
- What weights represent
- How Hebbian learning works
- Why interference occurs
- Static vs. dynamic parameters

### How does this relate to modern AI?

Great question! Our toy model demonstrates principles used in cutting-edge AI:

**Shared Concepts:**
- Synaptic plasticity (connection changes)
- Hebbian-style learning
- Memory interference
- Recurrent connections

**Real AI Systems:**
- **Dragon Hatchling (BDH)**: Uses synaptic memory in transformers
- **BDH-CQ**: Adds latent reasoning to synaptic memory
- **TTT (Test-Time Training)**: Recurrent learning during inference

See the "AI Research" tab for detailed connections!

### Can I use this for teaching?

Absolutely! synaptiCITY is designed for education:

**For Instructors:**
- Use in lectures/labs on neural networks
- Assign as homework exploration
- Demonstrate concepts live
- Export network states to show examples

**For Students:**
- Self-paced learning
- Visual intuition building
- Hands-on experimentation
- Quiz yourself with the 60-Second Test

### What age group is this for?

**Recommended for:**
- High school students (ages 15+) with basic math
- College students in CS/neuroscience
- Self-learners interested in AI
- Professionals wanting intuition about neural networks

**Prerequisites:**
- Basic understanding of graphs/networks
- Comfortable with simple equations
- Curiosity about how learning works!

---

## Achievements & Gamification

### What are achievements?

Achievements reward your exploration! Unlock badges by:
- **Teaching Master**: Teach 100 associations
- **Recall Expert**: Perform 50 successful recalls
- **Network Builder**: Create large networks
- **Explorer**: Try all features
- **Challenge Champion**: Complete all challenges

Check the "Achievements" tab to see your progress!

### What are challenges?

Challenges test your skills:

**Challenge Types:**
1. **Speed Run**: Teach a network quickly
2. **Perfect Recall**: Achieve 100% accuracy
3. **Large Network**: Build networks with many nodes
4. **Multi-Path**: Create competing connections

**Difficulty Levels:**
- Easy: Good for beginners
- Medium: Requires some skill
- Hard: Tests your understanding
- Expert: For masters only!

### How do I level up?

Earn XP by:
- Teaching associations: +10 XP
- Successful recalls: +15 XP
- Unlocking achievements: +50-200 XP
- Completing challenges: +100-500 XP
- Daily streaks: Bonus XP

Check your level in the Account tab!

---

## Community Features

### Can I see networks made by others?

Yes! Go to "Community" → "Browse Library" to explore:
- Popular networks
- Recent submissions
- Featured creations
- Networks by tag

Filter by category, search by name, or browse by tag!

### How do I submit my network to the community?

1. Create an interesting network
2. Go to "Community" → "Submit Network"
3. Add name, description, and tags
4. Choose permissions (public/derivatives)
5. Submit!

**Tips for good submissions:**
- Use descriptive names
- Explain what makes it interesting
- Add relevant tags
- Set appropriate permissions

### What are the leaderboard rankings?

The leaderboard shows top users by:
- Total XP earned
- Achievements unlocked
- Networks created
- Community contributions

Climb the ranks by actively using the platform!

---

## Performance & Technical

### Why is the app slow on my device?

**Common causes:**
1. **Large networks**: 50+ nodes can be demanding
2. **3D visualization**: Requires GPU acceleration
3. **Older device**: Mobile devices may struggle with animations
4. **Many browser tabs**: Close unused tabs

**Solutions:**
- Reduce network size
- Disable 3D visualization
- Use graph view instead of heatmap
- Close other tabs
- Try on desktop

### Does it work on mobile?

Yes! synaptiCITY is fully responsive:
- ✅ Touch gestures (swipe, pinch, tap)
- ✅ Mobile-optimized UI
- ✅ Installable as PWA
- ✅ Works offline
- ✅ Landscape mode supported

For best experience, use on tablet or larger phones.

### What browsers are supported?

**Fully Supported:**
- ✅ Chrome/Edge/Brave (latest)
- ✅ Safari (latest)
- ✅ Firefox (latest)

**Partially Supported:**
- ⚠️ Older browsers (may lack some features)
- ⚠️ IE11 (not supported)

For best experience, use a modern browser updated within the last year.

### How much data does it use?

**Initial load:** ~700KB (compressed)
- 160KB JavaScript
- 19KB CSS
- ~500KB assets (logos, icons)

**After first visit:** Nearly zero!
- Cached for offline use
- Only API requests use data
- Community features need internet

### Is my data private?

Yes! We take privacy seriously:

**What we collect:**
- Anonymous usage analytics (opt-in)
- Performance metrics
- Error reports (to fix bugs)

**What we DON'T collect:**
- Personal information (name, email)
- Your network data
- IP addresses
- Location data

See "Account" → "Analytics & Privacy" for full details and opt-out.

---

## Troubleshooting

### The network isn't learning

**Check:**
1. Is the learning rate too low? (try 0.1)
2. Are you teaching enough repetitions? (try 3-5)
3. Is the network reset between tests?
4. Are you selecting the correct input/output?

**Solution:** Try the guided tour again to verify the workflow.

### I can't see the visualization

**Possible issues:**
1. Browser doesn't support SVG/Canvas
2. GPU acceleration disabled
3. Window too small
4. JavaScript disabled

**Solution:** Update your browser, enable hardware acceleration, or try a different browser.

### The install prompt doesn't appear

**Reasons:**
1. Already installed
2. Dismissed within last 7 days
3. Incognito/private mode
4. Browser doesn't support PWA

**Solution:** Look for install icon in address bar, or manually add to home screen.

### My network disappeared after refresh

**Check:**
1. LocalStorage enabled?
2. Incognito mode (doesn't persist)?
3. Browser cleared cache?

**Solution:** Export important networks as JSON to save them permanently!

### Achievements aren't unlocking

**Verify:**
1. You meet the requirements
2. Achievements panel is open (to see notification)
3. Progress is tracked (check Account tab)

**Note:** Some achievements require specific sequences or conditions.

---

## Advanced Topics

### How do I analyze network behavior programmatically?

Export the network as JSON, then:

```javascript
const network = JSON.parse(exportedJSON);
const weights = network.weights; // 2D array

// Analyze weight distribution
const avgWeight = weights.flat().reduce((a,b) => a+b) / weights.flat().length;

// Find strongest connections
const connections = [];
for (let i = 0; i < weights.length; i++) {
  for (let j = 0; j < weights[i].length; j++) {
    if (i !== j && weights[i][j] > 0.5) {
      connections.push({ from: i, to: j, weight: weights[i][j] });
    }
  }
}
```

### Can I modify the source code?

Yes! It's open-source (MIT License):

```bash
git clone https://github.com/sorathiyalaksh37-lang/synaptiCITY.git
cd synaptiCITY
npm install
npm run dev
```

Core files:
- `src/lib/NeuralNetwork.ts` - Learning algorithm
- `src/lib/LearningRules.ts` - Different learning rules
- `src/components/*` - UI components

### How can I contribute?

We welcome contributions!

1. **Report bugs**: Open an issue on GitHub
2. **Suggest features**: Start a discussion
3. **Submit code**: Fork, code, test, pull request
4. **Improve docs**: Fix typos, clarify explanations
5. **Share**: Tell others about synaptiCITY!

See `CONTRIBUTING.md` (coming soon) for detailed guidelines.

---

## Still Have Questions?

- 📧 **Email**: [your-email@domain.com]
- 💬 **GitHub Discussions**: [GitHub Discussions](https://github.com/sorathiyalaksh37-lang/synaptiCITY/discussions)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/sorathiyalaksh37-lang/synaptiCITY/issues)
- 📚 **Documentation**: See README.md, DEPLOYMENT.md, PWA_GUIDE.md

---

**Last Updated**: September 4, 2026  
**synaptiCITY** - When connections become memory 🧠✨

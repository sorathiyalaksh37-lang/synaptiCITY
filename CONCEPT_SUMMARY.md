# synaptiCITY — Concept Summary

**Project Name:** synaptiCITY — When Connections Become Memory  
**Track:** Pathway Track — Educational Interactive Resource  
**Topic:** Synaptic Plasticity as Short-Term Memory  

---

## 1. The Claim

**Memory can emerge from temporarily changing the strength of connections in a neural system, enabling both rapid learning and interference between competing memories.**

*Falsifiability Statement:* If connection strength changes alone cannot produce recall behavior, or if co-activating associations does not produce measurable competition, this claim is disproven.

---

## 2. The Mechanism

### Hebbian Plasticity Rule

synaptiCITY models memory via Hebbian plasticity:

$$\Delta w = \eta \times a_i \times a_j$$

Where:
- **$\Delta w$**: change in synaptic connection weight
- **$\eta$**: learning rate parameter ($0.01 - 0.50$)
- **$a_i$**: pre-synaptic activation ($0.0 - 1.0$)
- **$a_j$**: post-synaptic activation ($0.0 - 1.0$)

### How Memory Emerges

1. **Initial State:** Connections start with small random weights ($w \approx 0.01$).
2. **Teaching Phase:** Co-activating input concept $i$ (e.g., DOG) and output concept $j$ (e.g., ANIMAL) increases weight $w_{ij}$ by $\Delta w = \eta \cdot a_i \cdot a_j$.
3. **Recall Phase:** Activating input $i$ evaluates output connection strengths. The node with highest strength ($\arg\max_j w_{ij}$) is recalled.
4. **Interference:** Teaching a competing association (DOG $\to$ PET) strengthens $w_{i, \text{PET}}$, competing directly against $w_{i, \text{ANIMAL}}$.

---

## 3. BDH & BDH-CQ Research Context

### Dragon Hatchling (BDH)

BDH (Kosowski et al., 2025) reformulates transformer attention as recurrent synaptic memory, replacing explicit token key-value (KV) caches with dynamic state updates.

$$h_t = f(W \cdot x_t + U \cdot h_{t-1})$$

Where $h_t$ represents an evolving hidden state storing sequence context.

**Connection to Model:** Our 2D weight matrix $W$ is a simplified pedagogical visualization of BDH's dynamic recurrent state $h_t$.

### BDH-CQ

BDH-CQ (Engdahl et al., 2026) extends BDH with recurrent latent reasoning, absorbing patterns from demonstrations without explicit verbal chain-of-thought tokens.

---

## 4. Published Evidence

| Architecture / Model | Context Memory Mechanism | ARC-AGI-1 Performance | Scaling & Cost Characteristics |
|---|---|---|---|
| **Standard Transformer** | Explicit KV Cache | Baseline benchmark | Quadratic compute/memory scaling with sequence length |
| **BDH** (Kosowski et al., 2025) | Recurrent Synaptic State | **29.5% pass@2** | Low memory footprint (~$0.0007/task) |
| **BDH-CQ** (Engdahl et al., 2026) | Recurrent Latent State | Published | Learns from few-shot demonstrations |
| **synaptiCITY (Toy)** | 2D Hebbian Weight Matrix | N/A (Educational) | $6 \times 6$ interpretable weight matrix |

---

## 5. Limitations & Educational Boundaries

### What We Do NOT Claim
1. We do **NOT** claim independent reproduction of BDH or BDH-CQ benchmarks.
2. Our toy model is **NOT** a full BDH implementation or a biological brain simulator.
3. Our simulation does **NOT** validate published benchmark papers; it cites them.

### Educational Boundaries
- **Appropriate For:** Building mental models of Hebbian co-activation, visual connection strength inspection, and experiencing memory interference.
- **NOT Appropriate For:** Predicting production transformer performance or learning backpropagation/gradient descent mechanics.

---

## 6. Primary Citations

1. **BDH Architecture:**  
   Kosowski, A., Uznański, P., Chorowski, J., Stamirowska, Z., & Bartoszkiewicz, M. (2025). *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain*. [arXiv:2509.26507](https://arxiv.org/abs/2509.26507).
2. **BDH-CQ Architecture:**  
   Engdahl, B., Kosowski, A., Chorowski, J., Stamirowska, Z., Uznański, P., Jiang, J., Phadke, R., Kinas, R., & Zhong, R. (2026). *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning*. [arXiv:2608.09888](https://arxiv.org/abs/2608.09888).
3. **Test-Time Training Context:**  
   Sun, Y., Li, X., Dalal, K., Xu, J., Vikram, A., Zhang, G., Dubois, Y., Chen, X., Wang, X., Koyejo, S., Hashimoto, T., & Guestrin, C. (2024). *Learning to (Learn at Test Time): RNNs with Expressive Hidden States*. [arXiv:2407.04620](https://arxiv.org/abs/2407.04620).

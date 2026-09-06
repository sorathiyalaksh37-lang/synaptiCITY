# synaptiCITY — Demo Presentation Script

**Target Duration:** 5–7 minutes total  
**Audience:** Hackathon judges, engineers, and educators  

---

## 1. The Hook (30 Seconds)

> *"Learning isn't a button press. In biological brains and next-generation AI architectures, memory emerges from temporarily changing connection strengths between neurons. Today we're showing synaptiCITY—an interactive, live-computed laboratory where you can watch synaptic plasticity create memory, experience competition between memories, and connect toy models directly to cutting-edge research like Dragon Hatchling (BDH)."*

---

## 2. Live Teach Demo (1 Minute)

- **Action:** Open the **"The ride"** simulation tab. Set Input: `DOG`, Output: `ANIMAL`, Repetitions: `3`. Click **PULSE CONNECTION**.
- **Narration:**
  > *"Notice what happens when we fire DOG and ANIMAL together. The system computes a real Hebbian update using $\Delta w = \eta \times a_i \times a_j$. Look at the Connection Inspector below: our initial weight was near zero ($0.010$), and after three pulses with learning rate $\eta = 0.10$, it stepped cleanly to $0.310$ with a $\Delta w$ of $+0.300$. The line in the neural graph visibly thickens and glows cyan. There are no static animations or pre-baked numbers here—every metric is computed live in your browser."*

---

## 3. Live Recall Demo (30 Seconds)

- **Action:** Scroll to **Station 02 — Recall**. Select Input `DOG` and click **TEST RECALL**.
- **Narration:**
  > *"Now we test recall without pointing to ANIMAL. The network evaluates connection strengths across all output nodes for input cue DOG. Because DOG $\to$ ANIMAL has the highest weight ($0.310$), the model accurately predicts ANIMAL with a confidence score of $0.310$. Memory has successfully emerged from connection strength alone."*

---

## 4. Competing Memory & Decay Demo (1–2 Minutes)

- **Action:** Scroll up to Station 01. Change Output to `PET`. Click **PULSE CONNECTION** 5 times.
- **Narration:**
  > *"What happens when the same cue acquires a second association? We now teach DOG $\to$ PET 5 times. Watch the Competing Memory Panel below. DOG $\to$ PET reaches a strength of $0.508$."*
- **Decay Narration (Honest Mechanism Disclosure):**
  > *"Look closely at DOG $\to$ ANIMAL's weight: it didn't stay static at $0.508$—it decreased to $0.459$. Why? Because synaptiCITY implements real short-term synaptic decay ($2\%$ per teaching pulse on inactive connections). Reinforcing DOG $\to$ PET actively fades unused connections, reproducing real short-term memory dynamics. When we test recall on DOG again, PET wins with a clear margin of $0.049$."*

---

## 5. Bridge to BDH Research (1–2 Minutes)

- **Action:** Switch to the **"Toy model → BDH"** tab.
- **Narration:**
  > *"Why does this matter for modern AI? Standard Transformers rely on massive token key-value (KV) caches that scale quadratically with context length. The Dragon Hatchling (BDH) architecture (Kosowski et al., 2025) reformulates attention as recurrent synaptic memory:*
  > 
  > $$h_t = f(W \cdot x_t + U \cdot h_{t-1})$$
  > 
  > *"Our $6 \times 6$ weight matrix is a 2D pedagogical visualization of BDH's dynamic recurrent state $h_t$. BDH achieves **29.5% pass@2 on ARC-AGI-1** at approximately **\$0.0007 per task**, proving that synaptic memory mechanisms can handle abstract reasoning without expensive KV caches.*
  > 
  > *Important disclaimer: synaptiCITY is an educational toy model designed for intuition, not a literal implementation or independent benchmark of BDH."*

---

## 6. Closing & Knowledge Check (1 Minute)

- **Action:** Switch to the **"Can you predict?"** tab.
- **Narration:**
  > *"To close your experience, synaptiCITY includes a 60-Second Test where learners verify their intuition by predicting synaptic weight changes and interference margins. Thank you—you can run synaptiCITY live in your browser right now without signing in."*

---

## Technical Contingencies & Operational Notes

- **Live Demo Fallback Plan:** If a browser animation hitches or audio fails during a live demonstration, immediately click **RESET MODEL** in the Control Panel to restore the default initial network state ($w \approx 0.01$) and proceed with DOG $\to$ ANIMAL teaching.
- **Pre-Presentation Dry Run Directive:** Before presenting live or recording video, run a complete dry-run through all 5 stages on the **deployed production URL** (not `localhost`) to verify font loading, web audio, and smooth scroll transitions in production environment.

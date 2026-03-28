```markdown
# Design System: Editorial Serenity

## 1. Overview & Creative North Star
**Creative North Star: The Mindful Curator**

This design system moves away from the sterile, clinical aesthetic often associated with cognitive tools. Instead, it adopts the persona of a high-end, mindful curator—someone who organizes information with grace, warmth, and absolute clarity. 

We break the "template" look by rejecting rigid borders and standard grids in favor of **Tonal Layering** and **Intentional Asymmetry**. By utilizing generous white space (negative space) and sophisticated typographic scales, we create an environment that feels premium yet deeply accessible. The interface should feel like a well-composed editorial spread: calm, encouraging, and effortlessly easy to navigate for senior users.

---

## 2. Colors: The Palette of Calm
The palette transitions from deep, authoritative blues to ethereal, soft lavenders, grounded by a "Surface-First" philosophy.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-low` card should sit on a `surface` background to create a soft edge without the harshness of a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of fine, heavy-weight paper.
*   **Base Layer:** `surface` (#f4faff)
*   **Secondary Content:** `surface-container-low` (#e8f6ff)
*   **Active/Interactive Containers:** `surface-container-highest` (#d3e5f1)

### Signature Textures & The "Glass" Rule
To elevate the experience beyond flat design:
*   **The Gradient CTA:** Primary buttons should use a subtle linear gradient from `primary` (#003194) to `primary-container` (#0a46c4) at a 135-degree angle. This adds a "touchable" depth.
*   **Glassmorphism:** For floating overlays or navigation bars, use `surface` at 80% opacity with a `20px` backdrop blur. This allows the warm colors of the game elements to bleed through, maintaining a sense of place.

---

## 3. Typography: Editorial Clarity
We pair **Plus Jakarta Sans** (Display/Headlines) with **Inter** (Body/Labels) to balance modern sophistication with high-legibility functionalism.

*   **Display & Headlines (Plus Jakarta Sans):** Used for game titles and "Success" states. The wide apertures and modern curves feel welcoming and non-threatening.
*   **Body & Titles (Inter):** Used for all instructional content. Inter’s tall x-height ensures readability even for users with visual impairments.
*   **Scale Strategy:** We utilize a high-contrast scale. A `display-lg` (3.5rem) headline next to a `body-lg` (1rem) creates a clear information hierarchy that guides the eye without effort.

---

## 4. Elevation & Depth: Tonal Layering
Depth in this system is a result of light and material, not artificial strokes.

*   **The Layering Principle:** Place a `surface-container-lowest` card (#ffffff) on a `surface-container-low` section (#e8f6ff). The 2% difference in luminance is enough for the human eye to perceive depth while keeping the interface "soft."
*   **Ambient Shadows:** For floating elements like Modals, use an extra-diffused shadow: `0px 20px 40px rgba(12, 30, 38, 0.06)`. The shadow uses the `on-surface` color (#0c1e26) at a very low opacity to mimic natural, ambient light.
*   **The Ghost Border Fallback:** If a container requires more definition (e.g., in high-glare environments), use the `outline-variant` token at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Buttons (The "Tappable" Standard)
*   **Primary:** Gradient fill (`primary` to `primary-container`), `round-xl` (1.5rem) corners. Minimum height of `64px` to ensure easy interaction.
*   **Secondary:** `surface-container-highest` fill with `primary` text. No border.
*   **Interaction:** On tap, the button should subtly scale down (98%) and deepen in color, providing tactile-like feedback.

### Memory Cards (The Core Grid)
*   **State - Hidden:** Use `secondary-container` (#c17bff) with a subtle "Glass" shimmer effect.
*   **State - Revealed:** Use `surface-container-lowest` (#ffffff) to make the iconography pop.
*   **Structure:** No borders. Use `elevation` via a soft ambient shadow to indicate the card is "above" the board.

### Lists & Selection
*   **The Divider Forbiddance:** Never use horizontal lines. Separate list items using `spacing-4` (1.4rem) or alternating tonal backgrounds (`surface` to `surface-container-low`).
*   **Selection Chips:** Use `secondary-fixed` (#f1dbff) for unselected and `secondary` (#803abd) with `on-secondary` (#ffffff) text for selected.

### Inputs
*   **Text Fields:** Use a "pill" shape (`round-full`). Use `surface-variant` as the background. The label should always be persistent in `label-md` above the field; never use disappearing placeholder text.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical layouts for home screens (e.g., a large headline offset to the left with a floating "Start" card to the right).
*   **Do** prioritize `primary-fixed` and `secondary-fixed` tones for a "friendly" feel that avoids the high-vibrancy fatigue of pure brand colors.
*   **Do** use `spacing-12` (4rem) and `spacing-16` (5.5rem) for section breathing room.

### Don’t
*   **Don’t** use 1px borders. If you feel you need one, use a tonal background shift instead.
*   **Don’t** use complex gestures (long press, swipe). Everything must be achievable through a single, confident tap.
*   **Don’t** use pure black (#000000) for text. Use `on-surface` (#0c1e26) to maintain a soft, premium "ink-on-paper" feel.
*   **Don’t** crowd the screen. If a screen feels full, move 30% of the content to a second step. Padding is a functional accessibility requirement, not a luxury.
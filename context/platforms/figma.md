# Figma Slots

Slots are a native Figma component property type that define flexible, open areas inside a component where designers can freely add, arrange, and swap content — **without detaching the instance**. They were introduced at Schema 2025 and began rolling out in open beta on March 5, 2025.

The formal Figma definition: *"Slots are flexible areas added to components that let you freely add and arrange content directly inside an instance without having to detach it, all while maintaining adherence to your team's design system."*

---

## Why Slots Exist

Before Slots, design systems had two options when components needed flexible content areas:

- **Over-engineer variants** — build a variant for every possible content configuration, leading to massive component sets and maintenance overhead.
- **Accept detaches** — let designers detach instances the moment a component didn't fit their need, breaking the link to the design system.

Slots offer a third path: **composition**. They let a component define *where* content goes and *what kind* of content belongs there, without dictating exactly *what* the content is. This mirrors how developers build UIs using `children` props in React or named slots in Vue and Web Components.

---

## How Slots Work

A slot is a frame layer inside a main component that has been designated as a slot property. When the component is used as an instance, that frame becomes an **open container** — a pink-bordered insertion point where designers can add their own layers.

Key behaviours:

- Any layer type can be placed inside a slot: component instances, text, images, and groups.
- Multiple layers can exist inside a single slot (e.g., a list of menu items).
- Slots carry all standard frame properties: auto layout, fills, min/max dimensions, effects, and variables.
- Changes to the main component still propagate to all instances — the slot connection remains live.
- Slots appear with a **pink border** on instances to signal they are open insertion points.

---

## Creating Slots (Component Authors)

There are three ways to add a slot to a main component:

| Method | How |
|---|---|
| Convert a frame | Select a nested frame → right-click → **Convert to slot** (⌘⇧S on Mac) |
| Wrap objects | Select non-frame layers → right-click → **Wrap in new slot** |
| Create from panel | Open the right panel's Properties section → add a slot property, then assign it to a frame |

After creating a slot, configure it in the right panel:

- **Name** — give the slot a clear, descriptive label (e.g., `Leading Icon`, `Actions`, `Content`).
- **Description** — explain what belongs here and any constraints.
- **Preferred instances** — optionally curate a list of components that should appear as suggestions when a designer fills the slot. These act as guardrails, not hard locks.

### Default Content vs. Empty Slots

- **Default content** — pre-populate the slot with a common example. Reduces decision load and helps designers understand intent at a glance.
- **Empty slot** — leave it blank to signal that content is required. Use this when there is no sensible default.

---

## Using Slots (Designers)

When working with a slotted component instance:

1. **Identify the slot** — look for the pink border on a region of the component.
2. **Add content** — drag any component from the canvas or Assets panel directly into the slot, or click the **+** button to browse preferred instances.
3. **Rearrange layers** — reorder layers within the slot just as you would inside a regular frame.
4. **Duplicate layers** — add more items (e.g., additional menu items in a dropdown).
5. **Reset the slot** — revert to the main component's default content at any time.
6. **Clear the slot** — remove all content to leave the slot empty.

---

## Slot Patterns

| Pattern | Description | Example in Scale |
|---|---|---|
| **General slot** | The primary body area of a component | Modal content area, Card body |
| **Named slots** | Multiple distinct insertion points on one component | Row's leading icon, content, and trailing action |
| **Group slots** | Holds an indeterminate number of identical child types | Tabs, Menu items |
| **Nested slots** | Slots within slotted sub-components across hierarchy levels | A Card containing a slotted Row |
| **Layout slots** | Applied to page-level templates for modular structure | Page templates with header/body/footer regions |

---

## Slots in Scale Components

Scale uses Slots in components where content structure is consistent but the content itself varies. The following Scale components are built with slots or are strong candidates for slot-based composition:

### Components with Slots

| Component | Slot(s) | What Goes In |
|---|---|---|
| **Modal** | Content | Any combination of body text, forms, images, or actions |
| **Card** | Content, Actions | Rich media, descriptive copy, button groups |
| **Row** | Leading Visual, Trailing Action | Icons, avatars, toggles, chevrons, buttons |
| **Menu** | Items | Menu item instances — add as many as needed |
| **Banner** | Actions | Button or link instances for the banner CTA |
| **Header** | Navigation, Actions | Nav link instances, button or icon button instances |
| **Footer** | Links, Social | Footer link groups, social icon instances |
| **Alert** | Actions | Inline button or link instances |

### How to Use Slots in Scale

1. **Insert a Scale component** from the Assets panel onto your canvas.
2. **Find the slot region** — identified by a pink border inside the instance.
3. **Drag a Scale component** from the Assets panel into the slot. For example, drag an **Icon** component into a Row's leading visual slot, or drag **Button** components into a Modal's actions slot.
4. Use the **preferred instances list** (shown when you click the slot's + button) to see which Scale components are recommended for that slot.
5. Add, remove, or reorder layers within the slot to match your design.

### Tips for Working with Scale Slots

- **Use Scale's own components to fill slots** — this keeps variables, dark mode, and responsive behaviour intact across the whole composition.
- **Don't detach to add content** — if a component has a slot, use it instead. Detaching breaks the live connection and loses all future design system updates.
- **Prefer instances over raw frames** — placing a raw frame or text layer inside a slot works but loses the benefit of Scale's variables and component properties.
- **Reset when in doubt** — if a slot gets messy, use "Reset to main component default" to start fresh without losing the rest of your instance customisation.

---

## Slots vs. Instance Swap Properties

Slots and instance swap properties are complementary, not interchangeable.

| | Slots | Instance Swap |
|---|---|---|
| **Content quantity** | Multiple layers, any quantity | One layer at a time |
| **Layout control** | Yes — auto layout and constraints apply | Inherits parent frame |
| **Use case** | Flexible content regions (body, list, actions) | Single element swap (icon, avatar) |
| **Figma panel** | Shown on instance as an open region | Shown in right panel as a dropdown |

For a single icon swap inside a button, instance swap is the right tool. For a modal body that might hold a form, an image, or a list of rows — that is a slot.

---

## Further Reading

- [Use slots to build flexible components — Figma Help Center](https://help.figma.com/hc/en-us/articles/38231200344599-Use-slots-to-build-flexible-components-in-Figma)
- [Migrate a library to using slots — Figma Help Center](https://help.figma.com/hc/en-us/articles/38607529833751-Migrate-a-library-to-using-slots)
- [How to supercharge your design system with Slots — Figma Blog](https://www.figma.com/blog/supercharge-your-design-system-with-slots/)
- [Slots in Design Systems — Nathan Curtis](https://nathanacurtis.substack.com/p/slots-in-design-systems)


# Smart Mock Agent Implementation

## Goal
Demonstrate "Intent Understanding" and "Iterative Editing" without requiring a live LLM connection yet.

## Logic

1. **Architect (Intent Parser)**
   - Inputs: User Mission
   - Logic:
     - **CREATE**: If mission contains "create", "new", "build":
       - Return plan to create `App.tsx` with a template based on keywords (e.g. "landing" -> Hero Section, "dashboard" -> Sidebar).
     - **EDIT**: If mission contains "change", "update", "fix":
       - Identify target file (default `App.tsx` or `page.tsx`).
       - Return plan to Update the file with specific instructions.

2. **Developer (Smart Editor)**
   - Inputs: Plan Step, Current File Content
   - Logic:
     - **WRITE**: If step is "Create...", write the template code.
     - **EDIT**: If step is "Update...", perform regex replacement on `this.state.files`.
       - Example: "Change color to red" -> `.replace(/bg-\w+-500/g, 'bg-red-500')`
       - Example: "Change title" -> `.replace(/<h1>.*<\/h1>/, '<h1>New Title</h1>')`

3. **Critic (Quality Gate)**
   - Inputs: Generated Code
   - Logic:
     - Check for `className` (Tailwind).
     - Check for `import ... from ...` (Modularity).
     - If missing, reject.

## Test Case
1. **Run 1**: "Create a dashboard with a sidebar." -> Generates `App.tsx` with Sidebar.
2. **Run 2**: "Change the sidebar color to blue." -> Updates `App.tsx` to have `bg-blue-800`.

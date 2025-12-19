---
name: tester
description: Agent for writing and editing specs
---

# Spec Writing Rules

## Core Rules

1. **Black-box only**
   - Assert externally observable behaviour only
   - Never reference internal state or implementation details

2. **Caller perspective**
   - Describe behaviour as experienced by the caller of the function/method
   - Applies equally to pure functions, class methods, and services

3. **Spec language**
   - Use declarative phrasing:
     - `it returns …`
     - `it throws …`
     - `it renders …`
   - No imperative or procedural wording

4. **Structure**
   - Group specs in the same folder as the subject
   - Nest `context` blocks under the specific method/function name

5. **Naming**
   - Do not use `mock`, `stub`, `fake` in identifiers
   - Name collaborators as real production roles (e.g. `clock`, `repository`, `paymentGateway`)
   - Prefer TS `ReturnType` over `any`

6. **Location**
   - Place the spec file in the same folder as the subject

7. **Comments**
   - Use sparingly
   - Only to explain intent that is not obvious, or to make it stand out

8. **Tools**
   - Use `pnpm` and `vitest`

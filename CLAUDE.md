# Coding Philosophy

## Core Principle
**Write the simplest code that works.** No abstractions, patterns, or clever tricks unless they demonstrably simplify the solution. When in doubt, choose the more direct approach.

## General Principles
- Favor simplicity: do one thing well, compose small tools
- Strong Unix philosophy: text streams, pipes, small focused utilities
- Terminal-first mindset: CLI > GUI, scripts > clicking, grep/sed/awk over IDEs
- Write code that's hackable, not "enterprise-grade"
- Flat is better than nested, explicit better than clever
- Make it work first, optimize or abstract only if needed
- Bias against premature abstraction, inheritance hierarchies, design patterns for their own sake
- Prefer plain functions over classes, data over objects
- No "clean code" dogma - pragmatic, working code > theoretical purity
- Eschew ceremony: minimal boilerplate, direct solutions

## Tool Selection
- Bash/shell scripts for simple system tasks, automation, and glue code
- Rust when you need performance, safety, or system-level control
- JavaScript/Node.js when you want hackable scripts, async operations, or ecosystem access
- Use the simplest tool that gets the job done reliably

## Language-Agnostic Guidelines

### Code Structure
- Default to procedural style with functional influences
- Early returns and guard clauses to reduce nesting
- Explicit is better than implicit - make intentions clear
- Write small, single-purpose functions that do one thing well
- Clear, descriptive names that explain what code does
- Break complex operations into composable pieces
- Make it work first, then reason about abstractions if truly needed

### Code Clarity
- Avoid clever one-liners - multi-step operations are easier to debug
- Prefer readability over brevity - code is read more than written
- Embrace simplicity - the best code is code that doesn't need to exist

### Error Handling
- Fail loud and fast with descriptive error messages
- Preserve error context and stack traces for debugging
- Handle errors at the appropriate level - don't swallow them

## Language-Specific Notes

### Bash Scripts
- Quote variables to prevent word splitting
- Use functions to organize code
- Only prefer `[[ ]]` over `[ ]` when valuable
- Do not use `local` or other bashism's, just declare variables normally
- Only use `set -euo pipefail` when adds value

### Rust
- Follow idiomatic Rust patterns but favor simplicity
- Prefer iterators when they're clearer, loops when they're not
- Make it work first, then we can "reason" about abstracting things
- Use `anyhow::Result` and `?` operator to simplify error handling
- Use `clap` for CLI scripts
- Use modules only when they help organize code

### JavaScript/Node.js
- Follow idiomatic JS patterns but keep it simple
- In async functions, always await and return values explicitly
- Use functional methods (map, filter, reduce) when they clarify intent

### TypeScript
- Always prefer Type, no Interface
- No any

---
order: 97
---

# OPLSS 2026 @ University of Oregon

<!-- ::: info Note -->
<!-- *These lectures took place at the [Oregon Programming Languages Summer School](https://www.cs.uoregon.edu/research/summerschool/summer26/) at [University of Oregon](https://www.uoregon.edu/) in June 2026.* -->
<!-- ::: -->

## Lecture 1: Separation Logic
- An introduction to Separation Logic, a modern Hoare logic
- The specification and verification of heap-manipulating programs
- Tools for verification and true bug detection, based on compositional symbolic execution


### Exercises
- [Simple assertions](/docs/oplss26/assertions-answers.pdf)
- [List concatenation](/docs/oplss26/listconc-answers.pdf)

### Resources
- [Lecture slides](/docs/oplss26/Lecture1.pdf)
- [Separation Logic proof rules](/docs/oplss26/SL_rules.pdf)
- [Gillian taster video](https://youtu.be/5TTBX4ecZkk)

### References
- [Separation Logic: A Logic for Shared Mutable Data Structures](https://www.computer.org/csdl/proceedings-article/lics/2002/14830055/12OmNxYbSXN) (John Reynolds, LICS 2002)

## Lecture 2: From Separation Logic to Compositional Symbolic Execution
- Experience with Separation Logic
- Core Compositional Symbolic Execution
- Automatic whole-program symbolic analysis and bug detection

### Exercises
- [Collections-C singly-linked lists](/docs/oplss26/cc_sll_exercise.pdf)

### Resources
- [Lecture slides](/docs/oplss26/Lecture2.pdf)

### References
- [Incorrectness logic](https://dl.acm.org/doi/10.1145/3371078) (Peter O'Hearn, POPL 2020)
- [Local Reasoning About the Presence of Bugs: Incorrectness Separation Logic](https://link.springer.com/chapter/10.1007/978-3-030-53291-8_14) (Azalea Raad et. al., CAV 2020)
- [Compositional Symbolic Execution for Correctness and Incorrectness Reasoning](https://vtss.doc.ic.ac.uk/publications/Loow2024Compositional.html) (Andreas Lööw et. al., ECOOP 2024)

## Lecture 3: Compositional Symbolic Execution
- Compositional symbolic execution, parametric on the state
- Semi-automatic verification of function specifications

### Resources
- [Lecture slides](/docs/oplss26/Lecture3.pdf)

### References
- [Compositional Symbolic Execution for the Next 700 Memory Models](https://vtss.doc.ic.ac.uk/publications/Loow2025Compositional.html) (Andreas Lööw et. al., OOPSLA 2025)

## Lecture 4: Semi-automatic Verification and Automatic Bug Detection
- An introduction to the Gillian platform
- Gillian-While with simple block-offset memory model
- Gillian-C with full-scale C memory

### Resources
- *Lecture slides coming soon*
<!-- - [Lecture slides](/docs/oplss26/Lecture4.pdf) -->
- [Gillian-While demo](https://youtu.be/l-XsFW-l29s)
- [The Gillian lab](./gillian-lab)

### References
- \[Lecture\] [Gillian: a Multi-language Platform for Compositional Symbolic Analysis](https://www.college-de-france.fr/en/agenda/seminar/program-logic-when-the-machine-reasons-about-its-software/gillian-multi-language-platform-for-compositional-symbolic-analysis) (Philippa Gardner, Program Logic Seminar at Collège de France 2021)
- [Gillian Debugging: Swinging Through the (Compositional Symbolic Execution) Trees](https://vtss.doc.ic.ac.uk/publications/Karmios2026Gillian.html) (Nat Karmios et. al., TACAS 2025)


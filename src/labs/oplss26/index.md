---
order: 97
---

# OPLSS 2026 @ University of Oregon

<!-- ::: info Note -->
<!-- *These lectures took place at the [Oregon Programming Languages Summer School](https://www.cs.uoregon.edu/research/summerschool/summer26/) at [University of Oregon](https://www.uoregon.edu/) in June 2026.* -->
<!-- ::: -->

## Lectures
### Lecture 1: An Introduction to Separation Logic
This lecture covers:
- An introduction to Separation Logic, a modern Hoare logic
- The specification and verification of heap-manipulating programs
- An overview of verification and bug-finding tools based on Compositional Symbolic Execution
- A taster of verifying WHILE programs with Gillian

### Lecture 2: Core Compositional Symbolic Execution
This lecture covers:
- Transitioning from Separation Logic to Compositional Symbolic Execution
- Core Compositional Symbolic Execution
- Automatic whole-program symbolic analysis and true bug detection

### Lecture 3: Compositional Symbolic Execution
This lecture covers:
- The foundations of Compositional Symbolic Execution
- An exploration of different memory models, including:
  - Linear heap
  - Simple block/offset memory (similar to C)
  - Dynamic objects (similar to JavaScript)
- Verified function specifications

### Lecture 4: The Gillian Framework
This lecture includes:
- A full introduction to Gillian, a CSE-based framework for program verification and bug-finding
- A deeper demonstration of WHILE verification with Gillian
- Our full-scale C memory model
- A demonstration of C verification with Gillian
- A discussion on the future of Compositional Symbolic Execution and Gillian

## Gillian Lab Exercises

We invite you to try out our Gillian lab exercises.

To get set up, follow these instructions:

1. Clone the lab repository and open it in VSCode.
   ```bash
   git clone https://github.com/GillianPlatform/gillian-lab.git --branch OPLSS_26
   code gillian-lab
   ```

2. If necessary, select *Yes, I trust the authors*.
   ![](/img/trust_authors.png)

3. Launch the dev container by clicking *"Reopen in Container"* on the popup.
   ![](/img/reopen_in_container.png)

   - If you cannot find the popup, open the Command Palette (`F1` or `Ctrl+Shift+P` by default) and select *"Dev Containers: Open Folder in Container..."* and select the `gillian-lab` folder.
     ![](/img/open_folder_in_container.png)

4. Open an exercise file (such as `0a_intro_auto.wisl`); you should see blue underlines that signify verification errors.
   ![](/img/lsp_example.png)

### Technical notes
- The language server highlights compilation errors (and other unexpected problems) in red, and verification failures in blue.
- The debugger supports breakpoints! This can be handy when restarting the debugger after making changes to your code; assign breakpoints to the relevant lines and click the *Continue* button <img src="./continue_button.png" style="display: inline-block; width: 1.75em; vertical-align: middle" />.
- If you get a `SIGPIPE` or `"Broken pipe"` error, try making a small change to your code and trying again.
   - *Note from Nat: I have **\*absolutely no idea\*** why this happens. Even with a repro, it disappears if I try to track it down 🙃*
- If Gillian seems stuck or unresponsive, or if the WISL language server fails to start, try opening the Command Palette with (`F1` or `Ctrl+Shift+P` by default) and running the *"Reload window"* command.

## References

- [Separation Logic: A Logic for Shared Mutable Data Structures](https://www.computer.org/csdl/proceedings-article/lics/2002/14830055/12OmNxYbSXN) (John Reynolds, LICS 2002)
- [Incorrectness logic](https://dl.acm.org/doi/10.1145/3371078) (Peter O'Hearn, POPL 2020)
- [Local Reasoning About the Presence of Bugs: Incorrectness Separation Logic](https://link.springer.com/chapter/10.1007/978-3-030-53291-8_14) (Azalea Raad et. al., CAV 2020)
- [Compositional Symbolic Execution for Correctness and Incorrectness Reasoning](https://vtss.doc.ic.ac.uk/publications/Loow2024Compositional.html) (Andreas Lööw et. al., ECOOP 2024)
- [Compositional Symbolic Execution for the Next 700 Memory Models](https://vtss.doc.ic.ac.uk/publications/Loow2025Compositional.html) (Andreas Lööw et. al., OOPSLA 2025)
- \[Lecture\] [Gillian: a Multi-language Platform for Compositional Symbolic Analysis](https://www.college-de-france.fr/en/agenda/seminar/program-logic-when-the-machine-reasons-about-its-software/gillian-multi-language-platform-for-compositional-symbolic-analysis) (Philippa Gardner, Program Logic Seminar at Collège de France 2021)
- [Gillian Debugging: Swinging Through the (Compositional Symbolic Execution) Trees](https://vtss.doc.ic.ac.uk/publications/Karmios2026Gillian.html) (Nat Karmios et. al., TACAS 2025)

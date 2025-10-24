# SSFT 2025

Welcome to the Gillian lab at SSFT 2025!

This lab takes the Separation Logic and Compositional Symbolic Execution theory you've seen in the lectures, and re-contextualise it with a semi-automatic verification tool built with Gillian.

## Installation instructions
Before you start, please install the following:

* [Docker](https://docs.docker.com/desktop/)
* [VSCode](https://code.visualstudio.com/)
* VSCode's ['Dev Containers' extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

Once that's done, follow these steps:

1. Clone the lab repository.
   ```bash
   git clone https://github.com/GillianPlatform/gillian-lab.git --branch SSFT25
   ```

2. If necessary, select *Yes, I trust the authors*.
   ![](/img/trust_authors.png)

3. Launch the dev container by clicking *"Reopen in Container"* on the popup.
   ![](/img/reopen_in_container.png)

   - If you cannot find the popup, open the Command Palette (`F1` or `Ctrl+Shift+P` by default) and select *"Dev Containers: Open Folder in Container..."* and select the `gillian-lab` folder.
     ![](/img/open_folder_in_container.png)

4. Gillian's Docker image should then be automatically downloaded, and VSCode will use it for your development environment.

## Lecture 1: Compositional Software Verification

This lecture covers:
- Separation logic
- Specification and verification of sequential programs for mutating data structures
- Tools inspired by separation logic, based on compositional symbolic execution

:download:`Main slides </_static/docs/cse-ssft25-lecture1.pdf>`

:download:`WISL slides </_static/docs/cse-ssft25-wisl.pdf>`

## Lab Session 1: An introduction to Gillian

These exercises are in the `lab1` directory of the lab repository. They include list algorithms to demonstrate:

* Folding and unfolding predicates
* Applying proof tactics and lemmas
* Calling functions compositionally
* Loop invariants

If you have time, check out exercises A-D from the `lab2` directory for some examples with different data structures.

## Lecture 2: Compositional Symbolic Execution

This lecture covers:

- Theoretical foundations - Compositional Symbolic Execution (CSE) and bi-abduction
  - CSE for a simple C-like state
  - State-parametric CSE
  - Functional compositionality
- State combinators for CSE 

## Lab session 2: Further experience with Gillian

These exercises are in the `lab1` directory of the lab repository. They include:

- Some fun, harder examples of data-structure algorithms
- List algorithms ported from the real-world [Collections-C library](https://github.com/srdja/Collections-C)
- Some harder iterative list algorithms

Feel free to tackle these in any order, and refer back to the Lab 1 exercises if you need a refresher.

## Misc. lab notes

- The language server highlights compilation errors (and other unexpected problems) in red, and verification failures in blue.
- The debugger supports breakpoints! This can be handy when restarting the debugger after making changes to your code; assign breakpoints to the relevant lines and click the *Continue* button <img src="./continue_button.png" style="display: inline-block; width: 1.75em; vertical-align: middle" />.
- If you get a `SIGPIPE` or `"Broken pipe"` error, try making a small change to your code and trying again.
   - *Note from Nat: I have **\*absolutely no idea\*** why this happens. Even with a repro, it disappears if I try to track it down 🙃*
- If Gillian seems stuck or unresponsive, or if the WISL language server fails to start, try opening the Command Palette with (`F1` or `Ctrl+Shift+P` by default) and running the *"Reload window"* command.

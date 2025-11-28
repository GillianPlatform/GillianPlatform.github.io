---
order: 98
---

# Student Lab 2025

::: info Note
*This lab took place at part of the [Scalable Software Verification course](https://www.imperial.ac.uk/computing/current-students/courses/70023/) at [Imperial College London](https://www.imperial.ac.uk/) in November 2025.*
:::

Welcome to the Gillian student lab!

This lab takes the Separation Logic and Compositional Symbolic Execution theory you've seen in the lectures, and re-contextualises it with a semi-automatic verification tool built with Gillian.

## Getting started
Before you start, please install the following:

* [Docker](https://docs.docker.com/desktop/)
  * Check that Docker is working properly with `docker ps`
* [VSCode](https://code.visualstudio.com/)
* VSCode's ['Dev Containers' extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

1. Clone the lab repository and open it in VSCode.
   ```bash
   git clone https://github.com/GillianPlatform/gillian-lab.git --branch STUDENT_2025
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

## Misc. notes

- The language server highlights compilation errors (and other unexpected problems) in red, and verification failures in blue.
- The debugger supports breakpoints! This can be handy when restarting the debugger after making changes to your code; assign breakpoints to the relevant lines and click the *Continue* button <img src="./continue_button.png" style="display: inline-block; width: 1.75em; vertical-align: middle" />.
- If you get a `SIGPIPE` or `"Broken pipe"` error, try making a small change to your code and trying again.
   - *Note from Nat: I have **\*absolutely no idea\*** why this happens. Even with a repro, it disappears if I try to track it down 🙃*
- If Gillian seems stuck or unresponsive, or if the WISL language server fails to start, try opening the Command Palette with (`F1` or `Ctrl+Shift+P` by default) and running the *"Reload window"* command.

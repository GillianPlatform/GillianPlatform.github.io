---
order: 98
---

# Student Lab 2025

Welcome to the Gillian student lab!

This lab takes the Separation Logic and Compositional Symbolic Execution theory you've seen in the lectures, and re-contextualises it with a semi-automatic verification tool built with Gillian.

## Getting started

1. Clone the lab repository and open it in VSCode.
   ```bash
   git clone https://github.com/GillianPlatform/gillian-lab.git --branch STUDENT_2025
   code gillian-lab
   ```

2. If necessary, select *Yes, I trust the authors*.
   ![](/img/trust_authors.png)

3. In the *Recommended* section of the extensions menu, install the suggested extension, titled *The Gillian Platform*.
   ![](/img/install_ext_recommended.png)

4. Open an exercise file (such as `0a_intro_auto.wisl`); you should see blue underlines that signify verification errors. If you don't, let us know!
   ![](/img/lsp_example.png)

## Survey

We'd hugely appreciate it if you completed a quick survey to help us evaluate Gillian and improve for next time!

[Click here to go to the survey.](https://imperial.eu.qualtrics.com/jfe/form/SV_02mXLq3ouLLK1Lg)

The survey password will be provided on the day.

## Misc. notes

- The language server highlights compilation errors (and other unexpected problems) in red, and verification failures in blue.
- The debugger supports breakpoints! This can be handy when restarting the debugger after making changes to your code; assign breakpoints to the relevant lines and click the *Continue* button <img src="./continue_button.png" style="display: inline-block; width: 1.75em; vertical-align: middle" />.
- If you get a `SIGPIPE` or `"Broken pipe"` error, try making a small change to your code and trying again.
   - *Note from Nat: I have **\*absolutely no idea\*** why this happens. Even with a repro, it disappears if I try to track it down 🙃*
- If Gillian seems stuck or unresponsive, or if the WISL language server fails to start, try opening the Command Palette with (`F1` or `Ctrl+Shift+P` by default) and running the *"Reload window"* command.

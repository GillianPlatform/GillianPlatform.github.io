---
order: 1
---

# Installing for Development

1. Install prerequisites
   
  On Debian or Ubuntu, run:
  ```bash
  sudo apt install git curl npm build-essential pkg-config \
    m4 python3-distutils python3-apt z3
  ```

  On macOS, make sure you have the XCode command line tools installed:
  ```
  xcode-select --install
  ```
  ...then make sure your development tools are up to date.

2. Install opam

  ```bash
  sudo apt install opam
  ```

3. Clone the source repository

  ```bash
  git clone https://github.com/GillianPlatform/Gillian.git
  ```

4. Prepare dependencies and build Gillian

  ```bash
  cd Gillian
  make init-dev
  eval $(opam env)
  dune build

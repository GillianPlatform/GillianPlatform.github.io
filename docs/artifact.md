---
id: artifact
title: PLDI-2020-Artifact
sidebar_label: PLDI-2020-Artifact
---

# Warm-Up

1. This document is, in fact, an `.md` document. We encourage you to open it in an `.md` viewer, such as [Typora](https://typora.io/#download) to have the proper experience. It is also available online [here](https://gillianplatform.github.io/docs/artifact).
2. The virtual machine you will download is directly in `.ova` format. Zipping it does not reduce its size, which is ~6Gb. Therefore, your download may take some time.
3. We are hosting the virtual machine at an Imperial Box server. We are not keeping track of who is accessing it.
4. Gillian comes with an accompanying [website](https://gillianplatform.github.io/) and [GitHub repository](https://github.com/GillianPlatform/Gillian/tree/PLDI20). Feel free to explore these as well. They are both in flux, but the provided GitHub link is to a tagged release corresponding to the VM.

# Getting Started

## Downloading and starting up the VM

We provide the artifact in the form of a VirtualBox `.ova` file, which can be downloaded from [https://imperialcollegelondon.app.box.com/v/gillian-pldi-20](here). Its MD5 hash is [TODO].

The VM was created using VirtualBox (Version 6.0.18 r136238 (Qt5.6.3), downloadable from [https://www.virtualbox.org/wiki/Download_Old_Builds_6_0](here).
You can import the VM by clicking on `File` and then on `Import Appliance`. There, navigate to and select the `.ova` file that you downloaded.

The operating system of the VM is Ubuntu 19.10 Eoan Ermine and the VM already has Guest Additions installed. The settings of the VM can be changed by right-clicking on it in the VM list and then left-clicking on `Settings` in the drop-down menu that appears. The relevant settings are:

- System
  - Base Memory: 4096 MB (go for more if your system can support it)
  - Processor(s): 4 (go for more if your system can support it)
  - Enable PAE/NX: On
  - Enable Nested Paging: On
- Display
  - Video Memory: 128 MB
  - Enable 3D Acceleration: On

They are set by default, and if you do not want to change them, you can just start the VM. The master password you can use for any and all authentication inside the VM is: `osboxes.org`.

## Basic testing

Open the terminal by pressing CTRL+ALT+T or by clicking on `Show Applications` in the bottom left corner, typing in `Terminal`, and clicking on the terminal icon. Once in the terminal, type `cd Gillian` to get to the main Gillian folder (`~/Gillian`).

### Rebuild Gillian

To rebuild Gillian, execute the following commands:

1. `rm -rf _build/ _esy/`                        (removes previous build information)
2. `esy`                                         (compiles Gillian as a library)
3. `esy init:env`                                (initialises Gillian-JS and Gillian-C)
4. `cd Gillian-JS/environment; ./remake.sh`      (compiles the JS-relevant binaries)
5. `cd ../../Gillian-C/environment; ./remake.sh` (compiles the C-relevant binaries)

This should take between one and two minutes in total.

### Test Gillian-JS against a bit of the Test262 official JavaScript test suite

From the main Gillian folder, execute

`esy x gillian-js test262 ../test262/test/built-ins/Number/`

At the end of the output, you should see the following lines:

```
Test Suites: 1 failed, 9 skipped, 8 passed, 18 total
Tests:       3 failed, 147 skipped, 144 passed, 294 total
Time:        [TIME] (for us, it was ~14s)

ALL FAILURES:
../test262/test/built-ins/Number/S9.3.1_A3_T1.js
../test262/test/built-ins/Number/S9.3.1_A3_T2.js
../test262/test/built-ins/Number/S9.3.1_A2.js
```

### Symbolically test a part of Buckets.js using Gillian-JS

From the main Gillian folder, execute

1. `cd Gillian-JS/environment/`                              (this is where all Gillian-JS symbolic testing should happen)
2. `./testCosetteFolder.sh Examples/Cosette/Buckets/bstree/` (runs the symbolic tests for the binary search trees of Buckets.js)

The testing should also take ~20 seconds. This time may vary, as the testing is performed using multiple threads. Eleven tests should be tested, starting from `Examples/Cosette/Buckets/bstree/bstree10.js` and finishing with `Examples/Cosette/Buckets/bstree/bstree9.js`. After each test, the test time will be printed. There should be no other output.

### Symbolically test a part of Collections-C using Gillian-C

From the main Gillian folder, execute

`./Gillian-C/environment/testFolder.sh ../collections-c/for-gillian/deque` (runs the symbolic tests for the deque of Collections-C)

The testing should take ~10 seconds, and the output should be as for Buckets.js, test name followed by test execution time, with 34 tests run, starting from `collections-c/for-gillian/deque/deque_test_addAt1.c` and finishing with `collections-c/for-gillian/deque/deque_test_zipIterReplace.c`.


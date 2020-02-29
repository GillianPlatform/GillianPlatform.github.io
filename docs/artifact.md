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

We provide the artifact in the form of a VirtualBox `.ova` file, which can be downloaded from [here](https://imperialcollegelondon.app.box.com/v/gillian-pldi-20). Its MD5 hash is `5fa97885f75dec9b33cb21ee788a0d48`.

The VM was created using VirtualBox (Version 6.0.18 r136238 (Qt5.6.3), downloadable from [here](https://www.virtualbox.org/wiki/Download_Old_Builds_6_0).
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

### Rebuilding Gillian

To rebuild Gillian, execute the following commands:

1. `rm -rf _build/ _esy/`                        (removes previous build information)
2. `esy`                                         (has to be run from the root folder, compiles the project)
3. `esy init:env`                                (initialises testing folders for Gillian-JS and Gillian-C)

This should take between one and two minutes in total.

### Testing Gillian-JS against a bit of the Test262 official JavaScript test suite

From the main Gillian folder, execute

```bash
esy x gillian-js test262 ../test262/test/built-ins/Number/
```

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

### Symbolically testing a part of Buckets.js using Gillian-JS

From the main Gillian folder, execute

1. `cd Gillian-JS/environment/`                              (this is where all Gillian-JS symbolic testing should happen)
2. `./testCosetteFolder.sh Examples/Cosette/Buckets/bstree/` (runs the symbolic tests for the binary search trees of Buckets.js)

The testing should also take ~20 seconds. This time may vary, as the testing is performed using multiple threads. Eleven tests should be executed, starting from `Examples/Cosette/Buckets/bstree/bstree10.js` and finishing with `Examples/Cosette/Buckets/bstree/bstree9.js`. After each test, the test time will be printed. There should be no other output.

### Symbolically testing a part of Collections-C using Gillian-C

From the main Gillian folder, execute

`./Gillian-C/environment/testFolder.sh ../collections-c/for-gillian/deque` (runs the symbolic tests for the deque of Collections-C)

The testing should take ~10 seconds, and the output should be as for Buckets.js, test name followed by test execution time, with 34 tests run, starting from `collections-c/for-gillian/deque/deque_test_addAt1.c` and finishing with `collections-c/for-gillian/deque/deque_test_zipIterReplace.c`.

# Step-By-Step Instructions

## Gillian-JS (Section 4.1)

<!-- prettier-ignore-start -->
:::info
Folders marked with the (:x:PLDI20) annotation are out of scope for this submission.
:::
<!-- prettier-ignore-end -->

`Gillian-JS` is the instantiation of Gillian to JavaScript (ECMAScript 5 Strict). It can be found in the `Gillian-JS` folder of the repository. Its implementation consists of the following:

- **Gillian-JS**
  - `bin`: Source of the `gillian-js` executable.
  - `environment`: Execution environment, not part of the repository, created using `esy init:env`. It contains useful scripts for testing Gillian-JS, and examples are copied in it so that they can be safely modified.
  - `examples`: Various examples.
    - `Fantine`: Bi-abduction examples (:x:PLDI20).
    - `Cosette`: Symbolic testing examples.
      - `buckets`: Tests for the Buckets.js library.
      - `case_studies`: Data structures used for initial evaluation (not reported).
    - `JaVerT`: Verification examples (:x:PLDI20).
  - `lib`: The core of Gillian-JS.
    - `compiler`: The JS-2-GIL compiler.
    - `JSIL`: Syntax of JSIL and related constructs.
    - `JSLogic`: Verification-related constructs (assertions, predicates, specifications, etc.) (:x:PLDI20).
    - `parsing`: JSIL parsing (programs, annotations, etc.).
    - `semantics`: Implementation of concrete and symbolic memory models.
      - `CObject.ml`: Concrete objects.
      - `CHeap.ml`: Concrete heaps.
      - `JSILCMemory.ml`: Concrete memory.
      - `SFVL.ml`: Symbolic field-value lists.
      - `SHeap.ml`: Symbolic heaps.
      - `JSILSMemory.ml`: Symbolic memory.
    - `test262`: Bulk testing for the Test262 test suite.
    - `utils`: Various utilities (configuration, I/O, etc.).
  - `runtime`: JS-2-GIL compiler runtime (JSIL implementations of JavaScript internal and built-in functions).
  - `scripts`: Various scripts used for setting up the environment and running the analyses.

### Coverage of JS-2-GIL

JS-2-GIL is a compiler from [ECMAScript ES5 Strict](https://www.ecma-international.org/ecma-262/5.1/) to GIL. JS-2-GIL has broad coverage. It supports the entire core (chapters 8-14 of the standard), with the exception of the `RegExp` literal, as well as all of the JavaScript built-in libraries/functionalities except the following:

- `Date`, `RegExp`, `JSON`
- `Number.prototype.toFixed`
- `String.fromCharCode`
- `charCodeAt`, `localeCompare`, `match`, `replace`, `search`, `split`, `trim`, `toLocaleLowerCase`, `toLocaleUpperCase`, `toLowerCase`, `toUpperCase` (in `String.prototype`)
- `decodeURI`, `decodeURIComponent`, `encodeURI`, `encodeURIComponent`, `parseInt`, `parseFloat` (in the global object)

Additionally, indirect `eval` is not supported, as it is meant to be executed as non-strict code. Furthermore, all `Function` constructor code runs as strict-mode code.

### Correctness of JS-2-GIL

The JS-2-GIL compiler can be split into two compilers: JS-2-JSIL, which compiles JavaScript to JSIL, the intermediate representation that we have used in [JaVerT]/[Cosette]/[JaVerT 2.0] (references at end of document); and JSIL-2-GIL, the compiler from JSIL to GIL, the intermediate representation of Gillian.

Previously, we have tested JS-2-JSIL against [this commit (from May 30th 2016)](https://github.com/tc39/test262/commit/91d06f) of Test262, the JavaScript official test suite. As this commit of Test262 targets ES6, we had to identify the subset of tests that are appropriate for JS-2-JSIL, as explained in detail in [JaVerT], obtaining 8797 applicable tests, of which JS-2-JSIL passes 100%.

We have initially tested JS-2-GIL successfully on the same 8797 tests and reported this in the submitted version of the paper. However, these tests were not systematically categorised and we were not able to automate the testing process to our satisfaction using the bulk testing mechanism of Gillian. For this reason, we have chosen to work with the latest version of Test262, forked [here](https://github.com/GillianPlatform/javert-test262), where each test comes with a precise description of its intended outcome. For example, a test that is supposed to fail at parsing time with a JavaScript native syntax error will contain the following in its header:

```
negative:
  phase: parse
  type: SyntaxError
```

We re-filter Test262 to find the applicable tests and run them using JS-2-GIL and the concrete semantics of Gillian-JS. The summary results are presented in the table below and will be included in the final version of the paper. A more detailed, per-folder breakdown is available further below.

|                              | Language | Built-ins | Total |
|:----------------------------:|:--------:|:---------:|:-----:|
|       **Total tests**        |   3202   |   7860    | 11062 |
|       Non-strict tests       |   583    |    136    |  719  |
|       **Strict tests**       |   2619   |   7724    | 10343 |
|     Non-strict features      |    41    |    50     |  91   |
|  For unimplemented features  |    17    |   1182    | 1199  |
| Using unimplemented features |    23    |    12     |  35   |
|             ES6+             |    3     |     2     |   5   |
|        **Applicable**        |   2535   |   6748    | 9013  |
|           Passing            |   2530   |   6745    | 9005  |
|           Failing            |    5     |     3     |   8   |

#### Explanation: Table Columns

- **Language**: tests for the core language (chapters 8-14 of the [ECMAScript ES5 standard](https://www.ecma-international.org/ecma-262/5.1/)).
- **Built-ins**: tests for the built-in libraries (chapter 15 of the [ECMAScript ES5 standard](https://www.ecma-international.org/ecma-262/5.1/)).
- **Total**: all tests.

#### Explanation: Table Rows

- **Total tests**: all tests.
- **Non-strict tests** (filtered out): tests that should be run only in non-strict mode. They contain the `flags: [noStrict]` directive and are filtered out automatically by our bulk testing mechanism.
- **Strict tests**: tests that should be run in strict mode.
- **Non-strict features** (filtered out): tests that combine strict and non-strict mode, using either indirect eval or the non-strict `Function` constructor (91 tests, list available in the `non_strict_tests` variable of [`test262_filtering.ml`](https://github.com/GillianPlatform/Gillian/blob/master/Gillian-JS/lib/Test262/Test262_filtering.ml)).
- **For unimplemented features** (filtered out): tests that test unimplemented features, such as the`JSON` library (1205 tests, list available in the `tests_for_unimplemented_features` variable of [`test262_filtering.ml`](https://github.com/GillianPlatform/Gillian/blob/master/Gillian-JS/lib/Test262/Test262_filtering.ml)). Note that the structural tests for some of these features still pass, as we have the appropriate stubs in the initial heap.
- **Using unimplemented features** (filtered out): tests that use unimplemented features to test behaviours of implemented features, with the most prominent examples being the `Date` constructor and `RegExp` literals (29 tests, list available in the `tests_using_unimplemented_features` variable of [`test262_filtering.ml`](https://github.com/GillianPlatform/Gillian/blob/master/Gillian-JS/lib/Test262/Test262_filtering.ml)).
- **ES6+** (filtered out): tests that use behaviours beyond ES5 (5 tests, list available in the `es6_tests` variable of [`test262_filtering.ml`](https://github.com/GillianPlatform/Gillian/blob/master/Gillian-JS/lib/Test262/Test262_filtering.ml)). For example, two language tests test for the ES6 completion of the `if` statement (returns `undefined` instead of the ES5 `empty`), one language test uses a function declaration in statement position (disallowed in ES5), and two built-in tests require a specific ordering of object keys (implementation-dependent in ES5).
- **Applicable**: the number of tests applicable to JS-2-GIL.
- **Passing**: the number of tests passing.
- **Failing**: the number of tests failing.

#### Explanation: Failing Tests

The following eight tests

- `test262/test/language/line-terminators/7.3-6.js`
- `test262/test/language/line-terminators/7.3-5.js`
- `test262/test/language/line-terminators/7.3-15.js`
- `test262/test/language/line-terminators/invalid-string-cr.js`
- `test262/test/language/source-text/6.1.js`
- `test262/test/built-ins/Number/S9.3.1_A3_T1.js`
- `test262/test/built-ins/Number/S9.3.1_A3_T2.js`
- `test262/test/built-ins/Number/S9.3.1_A2.js`

fail due to a discrepancy between how Unicode characters are treated in JavaScript (either UCS-2 or UTF-16) and OCaml (sequences of bytes). One solution would be to move to strings provided by the [`Camomile`](http://camomile.sourceforge.net/) library instead of the native OCaml strings.

#### Reproducing the Results

1. Our [forked Test262 repository](https://github.com/GillianPlatform/javert-test262) is already cloned on the machine under the path `~/test262`. Inside that folder, you can find the Test262 tests in the `test` subfolder. In particular, `test/language` contains the core language tests, whereas `test/built-ins` contains the tests for the built-in libraries.
2. To run all of the tests, execute the following command inside your Gillian folder:

```bash
esy
esy x javert bulk-exec ../test262
```

The testing should take approximately thirty minutes. The bulk tester will actively report progress, folder-by-folder, and signal any test failures encountered. In the end, a list of all failed tests (the eight given above) will be printed.

1. If you would like to test a specific subfolder of the test suite, simply add it to the test path. For example, to run only the tests for `Array.prototype.reduce`, execute, from the main Gillian folder:

```bash
esy x gillian-js test262 ../test262/test/built-ins/Array/prototype/reduce/
```

4. If you would like to examine the filtered tests, you can find them in [`test262_filtering.ml`](https://github.com/GillianPlatform/Gillian/blob/master/Gillian-JS/lib/Test262/Test262_filtering.ml).

#### Detailed Per-Folder Breakdown: Language

|                                  | arguments-object | asi | comments | directive-prologue | eval-code | expressions | function-code | future-reserved-words | global-code | identifier-resolution | identifiers | keywords | line-terminators | literals | punctuators | reserved-words | source-text | statements | types | white-space | Total |
|:--------------------------------:|:----------------:|:---:|:--------:|:------------------:|:---------:|:-----------:|:-------------:|:---------------------:|:-----------:|:---------------------:|:-----------:|:--------:|:----------------:|:--------:|:-----------:|:--------------:|:-----------:|:----------:|:-----:|:-----------:|:-----:|
|          **All tests**           |        46        | 101 |    18    |         62         |    58     |    1469     |      212      |          55           |      3      |          11           |     49      |    25    |        41        |   145    |     11      |       13       |      1      |    733     |  109  |     40      | 3202  |
|       **Non-strict tests**       |        12        |  0  |    0     |         57         |     4     |     153     |      107      |           7           |      2      |           5           |      0      |    0     |        0         |    0     |      0      |       0        |      0      |    227     |   9   |      0      |  583  |
|         **Strict tests**         |        34        | 101 |    18    |         5          |    54     |    1316     |      105      |          48           |      1      |           6           |     49      |    25    |        41        |   145    |     11      |       13       |      1      |    506     |  100  |     40      | 2619  |
|     **Non-strict features**      |        0         |  0  |    0     |         0          |    25     |      1      |       5       |           0           |      0      |           0           |      0      |    0     |        0         |    0     |      0      |       0        |      0      |     10     |   0   |      0      |  41   |
|  **For unimplemented features**  |        0         |  0  |    0     |         0          |     0     |      0      |       0       |           0           |      0      |           0           |      0      |    0     |        0         |    17    |      0      |       0        |      0      |     0      |   0   |      0      |  17   |
| **Using unimplemented features** |        0         |  0  |    2     |         0          |     0     |      3      |       4       |           0           |      0      |           0           |      0      |    0     |        0         |    12    |      0      |       0        |      0      |     2      |   0   |      0      |  23   |
|             **ES6+**             |        0         |  0  |    0     |         0          |     0     |      0      |       0       |           0           |      0      |           0           |      0      |    0     |        0         |    0     |      0      |       0        |      0      |     3      |   0   |      0      |   3   |
|          **Applicable**          |        34        | 101 |    16    |         5          |    29     |    1312     |      96       |          48           |      1      |           6           |     49      |    25    |        41        |   116    |     11      |       13       |      1      |    491     |  100  |     40      | 2535  |
|           **Passing**            |        34        | 101 |    16    |         5          |    29     |    1312     |      96       |          48           |      1      |           6           |     49      |    25    |        37        |   116    |     11      |       13       |      0      |    491     |  100  |     40      | 2530  |
|           **Failing**            |        0         |  0  |    0     |         0          |     0     |      0      |       0       |           0           |      0      |           0           |      0      |    0     |        4         |    0     |      0      |       0        |      1      |     0      |   0   |      0      |   5   |

#### Detailed Per-Folder Breakdown: Built-ins

|                                  | Array | Boolean | Date | decodeURI | decodeURIComponent | encodeURI | encodeURIComponent | Error | eval | Function | global | Infinity | isFinite | isNan | JSON | Math | NaN | Number | Object | parseFloat | parseInt | RegExp | String | undefined | Total |
|:--------------------------------:|:-----:|:-------:|:----:|:---------:|:------------------:|:---------:|:------------------:|:-----:|:----:|:--------:|:------:|:--------:|:--------:|:-----:|:----:|:----:|:---:|:------:|:------:|:----------:|:--------:|:------:|:------:|:---------:|:-----:|
|          **All tests**           | 2171  |   42    | 430  |    52     |         52         |    28     |         28         |  33   |  7   |   398    |   31   |    7     |    2     |   2   |  90  |  81  |  7  |  152   |  2892  |     40     |    57    |  501   |  749   |     8     | 7860  |
|       **Non-strict tests**       |  27   |    0    |  0   |     0     |         0          |     0     |         0          |   0   |  0   |    88    |   4    |    2     |    0     |   0   |  0   |  0   |  2  |   0    |   7    |     0      |    0     |   0    |   3    |     3     |  136  |
|         **Strict tests**         | 2144  |   42    | 430  |    52     |         52         |    28     |         28         |  33   |  7   |   310    |   27   |    5     |    2     |   2   |  90  |  81  |  5  |  152   |  2885  |     40     |    57    |  501   |  746   |     5     | 7724  |
|     **Non-strict features**      |   0   |    0    |  0   |     0     |         0          |     0     |         0          |   0   |  0   |    50    |   0    |    0     |    0     |   0   |  0   |  0   |  0  |   0    |   0    |     0      |    0     |   0    |   0    |     0     |  50   |
|      **For unimplemented**       |   0   |    0    |  17  |    45     |         45         |    21     |         21         |   0   |  0   |    0     |   0    |    0     |    0     |   0   |  81  |  0   |  0  |   5    |   5    |     33     |    50    |  455   |  404   |     0     | 1182  |
| **Using unimplemented features** |   3   |    0    |  0   |     0     |         0          |     0     |         0          |   0   |  0   |    3     |   0    |    0     |    0     |   0   |  0   |  0   |  0  |   0    |   0    |     0      |    0     |   0    |   6    |     0     |  12   |
|             **ES6+**             |   0   |    0    |  0   |     0     |         0          |     0     |         0          |   0   |  0   |    0     |   0    |    0     |    0     |   0   |  0   |  0   |  0  |   0    |   2    |     0      |    0     |   0    |   0    |     0     |   2   |
|          **Applicable**          | 2141  |   42    | 413  |     7     |         7          |     7     |         7          |  33   |  7   |   257    |   27   |    5     |    2     |   2   |  9   |  81  |  5  |  147   |  2878  |     7      |    7     |   46   |  336   |     5     | 6748  |
|           **Passing**            | 2141  |   42    | 413  |     7     |         7          |     7     |         7          |  33   |  7   |   257    |   27   |    5     |    2     |   2   |  9   |  81  |  5  |  144   |  2878  |     7      |    7     |   46   |  336   |     5     | 6745  |
|           **Failing**            |   0   |    0    |  0   |     0     |         0          |     0     |         0          |   0   |  0   |    0     |   0    |    0     |    0     |   0   |  0   |  0   |  0  |   3    |   0    |     0      |    0     |   0    |   0    |     0     |   3   |

### Writing Symbolic Tests

The whole-program symbolic testing module of Gillian-JS (codenamed Cosette) extends JavaScript with a mechanism for declaring symbolic variables and performing first-order reasoning on them.

#### Declaring Symbolic Variables

One can declare untyped symbolic variables, symbolic booleans, symbolic strings, and symbolic numbers as follows:

```javascript
var x = symb(x); // Untyped symbolic variable

var b = symb_number(b); // Symbolic boolean
var n = symb_number(n); // Symbolic number
var s = symb_string(s); // Symbolic string
```

The single parameters provided to these functions indicate the name of the created symbol, or _logical variable_, that Cosette will use in the reasoning. Normally, we choose these to coincide with the JavaScript variables in which they are stored so that the outputs of the analysis are more readable.

#### Assumptions and Assertions

Cosette provides a mechanism for reasoning about the symbols, in the form of assumptions and assertions, as follows:

```javascript
Assume(B); // Assume that the boolean expression B holds
Assert(B); // Assert that the boolean expression B holds
```

The grammar of boolean expressions (`B`) and expressions (`E`) is (approximately) as follows:

```c
B ::=
  | x                         // (Boolean) variables
  | E = E                     // Equality
  | E < E | E <= E            // Comparison
  | not B | B and B | B or B  // Logical operators

E ::=
  | c                           // Constants
  | x                           // Variables
  | E + E | E - E | ...         // Numeric operators
  | E ++ E | s-len E | s-nth E  // String concat, length, and n-th
```

Here is the example of a symbolic test using assumptions and assertions:

```javascript
// Create two symbolic numbers
var n1 = symb_number(n1), n2 = symb_number(n2);

// Assume that they are non-negative and different
Assume((0 <= n1) and (0 <= n2) and (not (n1 = n2)));

// Perform some calculations
var res = f(n1, n2);

// Assert, for example, that n1 and n2 are not greater than the result
Assert((n1 <= res) and (n2 <= res));
```

This example is already in the repository (with `f` instantiated to `n1 + n2`), and you can run it, starting from the `Gillian` folder, as follows:

```bash
esy
esy init:env
cd JaVerT/environment
esy x gillian-js wpst Examples/Cosette/simple_example.js -s
```

Since the assertion in the end does hold, there will be no output from Cosette, meaning that the test has passed. If however, you change `n1 + n2` to `n1 * n2` and re-run the example, you will be faced with the following error message and counter-model:

```
Assert failed with argument ((#n1 <=# (#n1 * #n2)) /\ (#n2 <=# (#n1 * #n2))).
Failing Model:
  [ (#n2: 1), (#n1: 0) ]
```

which means that the assertion does not hold if `n1 = 0` and `n2 = 1`. Here, variables prefixed by `#` denote logical variables; in this case, the parameters given to the `symb_number` function.

#### Semantics of Operators

Importantly, the semantics of all of the operators in assumptions and assertions is deliberately **NOT** as in JavaScript. For example, comparison and numeric operators do not perform any implicit type coercions. If you want to use JavaScript comparison/numeric operators, say `<=`, you can proceed as follows:

```javascript
var res_leq_n1 = n1 <= res;

Assert(n1_leq_res);
```

#### Typing and Objects in Symbolic Tests

Since we do not (yet) perform lazy initialisation in symbolic execution, errors may occur if you attempt to reason about symbolic objects or untyped symbolic variables. This can be prevented as follows:

```javascript
var x = symb(x);
Assume(not (typeOf x = Obj));
```

where `typeOf` is the built-in GIL typing operator and `Obj` is the built-in GIL object type. In this way, it is guaranteed that `x` is not an object (but still may be equal to `null`).

### Symbolic Testing of Buckets.js

We symbolically test Buckets.js, a real-world JavaScript data-structure library, with the goal of obtaining 100% line coverage. The results are presented in the table below, with each row containing:

- The name of the folder being tested, which also indicates the data structure in question
- The number of tests required for 100% line coverage
- The total number of GIL commands executed by running these tests
- The total testing time (in seconds)

#### Testing Results

|   Data Structure    | Tests  |  GIL Commands  |  Time (s)  |
|:-------------------:|:------:|:--------------:|:----------:|
|     **arrays**      |   9    |    330,147     |   2.584    |
|       **bag**       |   7    |   1,343,393    |   4.813    |
|     **bstree**      |   11   |   3,751,092    |   10.370   |
|   **dictionary**    |   7    |    401,575     |   1.884    |
|      **heap**       |   4    |   1,492,204    |   2.932    |
|   **linkedlist**    |   9    |    588,714     |   3.999    |
| **multidictionary** |   6    |   1,106,650    |   3.772    |
|  **priorityqueue**  |   5    |   2,312,226    |   3.871    |
|      **queue**      |   6    |    407,106     |   2.090    |
|       **set**       |   6    |   2,178,222    |   4.457    |
|      **stack**      |   4    |    306,449     |   1.661    |
|      **Total**      | **74** | **14,217,778** | **42.443** |

The current results are faster than reported in the submitted version. This is a result of improvements to the Gillian/Gillian-JS symbolic engine.
On the other hand, the number of run commands is marginally greater, due to minor changes to the JS-2-GIL compiler and the symbolic engine.

#### Reproducing the Results

Starting from the `Gillian` folder, execute the following:

```bash
esy
esy init:env
cd Gillian-JS/environment
```

Then, to reproduce the results for a specific folder from the first column of the above table, execute the following:

```bash
./testCosetteFolder.sh Examples/Cosette/Buckets/[folder]
```

In order to obtain the number of executed commands, append the `count` parameter to the last command. Therefore, for example, the command to run the tests for the `queue` data structure and obtain the number of executed commands is

```bash
./testCosetteFolder.sh Examples/Cosette/Buckets/queue count
```

##### Notes

1. The times obtained in the VM should be representative if run on a machine with a comparable specification (Intel Core i7-4980HQ CPU 2.80 GHz, DDR3 RAM 16GB, 256GB SSD) with no other applications running. Some (proportional) discrepancy is to be expected.
2. The times obtained when counting executed commands will be slower, due to the fact that the tests will be run in single-threaded mode.

#### Detailed Per-Folder Breakdown: Buckets.js

|    **arrays**    |   1    |   2    |   3    |   4    |   5    |   6    |   7    |   8    |   9    | **Total** |
|:----------------:|:------:|:------:|:------:|:------:|:------:|:------:|:------:|:------:|:------:|:---------:|
|   **Time (s)**   | 0.261  | 0.269  | 0.254  | 0.270  | 0.263  | 0.294  | 0.251  | 0.488  | 0.234  |   2.584   |
| **GIL Commands** | 33,903 | 34,675 | 34,896 | 42,866 | 30,483 | 55,210 | 34,765 | 39,532 | 23,817 |  330,147  |

|     **bag**      |   1    |   2    |    3    |    4    |    5    |    6    |    7    | **Total** |
|:----------------:|:------:|:------:|:-------:|:-------:|:-------:|:-------:|:-------:|:---------:|
|   **Time (s)**   | 0.485  | 0.430  |  0.922  |  0.604  |  0.553  |  0.887  |  0.932  |   4.813   |
| **GIL Commands** | 99,395 | 60,935 | 301,687 | 208,336 | 158,635 | 200,411 | 313,994 | 1,343,393 |

|  **bstree**  |   1   |   2   |   3   |   4   |   5   |   6   |   7   |   8   |   9   |  10   |  11   | **Total** |
|:------------:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:---------:|
| **Time (s)** | 0.659 | 1.728 | 0.626 | 0.689 | 0.921 | 0.906 | 0.908 | 0.980 | 0.671 | 0.697 | 1.585 |  10.370   |
| **GIL Commands** | 99,395 | 60,935 | 301,687 | 208,336 | 158,635 | 200,411 | 313,994 | 1,343,393 |

|  **dictionary**  |   1    |   2    |   3    |   4    |   5    |   6    |   7    | **Total** |
|:----------------:|:------:|:------:|:------:|:------:|:------:|:------:|:------:|:---------:|
|   **Time (s)**   | 0.298  | 0.238  | 0.218  | 0.363  | 0.240  | 0.226  | 0.301  |   1.884   |
| **GIL Commands** | 61,161 | 54,140 | 44,569 | 55,033 | 55,914 | 41,904 | 88,854 |  401,575  |

|     **heap**     |    1    |    2    |    3    |    4    | **Total** |
|:----------------:|:-------:|:-------:|:-------:|:-------:|:---------:|
|   **Time (s)**   |  0.560  |  1.199  |  0.507  |  0.666  |   2.932   |
| **GIL Commands** | 135,140 | 804,659 | 169,522 | 382,883 | 1,492,204 |

|  **linkedlist**  |   1    |   2    |   3    |   4    |   5    |   6    |   7    |   8    |   9    | **Total** |
|:----------------:|:------:|:------:|:------:|:------:|:------:|:------:|:------:|:------:|:------:|:---------:|
|   **Time (s)**   | 0.547  | 0.572  | 0.588  | 0.445  | 0.291  | 0.289  | 0.270  | 0.644  | 0.353  |   3.999   |
| **GIL Commands** | 43,209 | 57,458 | 97,728 | 82,345 | 63,645 | 66,093 | 30,794 | 97,225 | 50,217 |  588,714  |

| **multidictionary** |    1    |    2    |    3    |    4    |    5    |    6    | **Total** |
|:-------------------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:---------:|
|    **Time (s)**     |  0.488  |  0.812  |  0.586  |  0.576  |  0.684  |  0.626  |   3.772   |
|  **GIL Commands**   | 130,145 | 312,351 | 166,638 | 145,627 | 158,934 | 192,955 | 1,106,650 |

| **priorityqueue** |    1    |    2    |    3    |    4    |     5     | **Total** |
|:-----------------:|:-------:|:-------:|:-------:|:-------:|:---------:|:---------:|
|   **Time (s)**    |  0.713  |  0.711  |  0.490  |  0.884  |   1.073   |   3.871   |
| **GIL Commands**  | 399,730 | 287,433 | 121,329 | 450,539 | 1,053,195 | 2,312,226 |

|    **queue**     |   1    |   2    |   3    |   4    |   5    |    6    | **Total** |
|:----------------:|:------:|:------:|:------:|:------:|:------:|:-------:|:---------:|
|   **Time (s)**   | 0.488  | 0.812  | 0.586  | 0.576  | 0.684  |  0.626  |   3.772   |
| **GIL Commands** | 71,514 | 69,962 | 45,067 | 36,767 | 62,624 | 121,172 |  407,106  |

|     **set**      |   1    |    2    |     3     |    4    |   5    |    6    | **Total** |
|:----------------:|:------:|:-------:|:---------:|:-------:|:------:|:-------:|:---------:|
|   **Time (s)**   | 0.408  |  0.677  |   1.661   |  0.647  | 0.310  |  0.754  |   4.457   |
| **GIL Commands** | 78,959 | 242,304 | 1,265,278 | 232,776 | 66,700 | 292,205 | 2,178,222 |

|    **stack**     |   1    |   2    |   3    |    4    | **Total** |
|:----------------:|:------:|:------:|:------:|:-------:|:---------:|
|   **Time (s)**   | 0.352  | 0.324  | 0.349  |  0.636  |   1.661   |
| **GIL Commands** | 52,233 | 44,958 | 55,097 | 154,161 |  306,449  |

### Reproducing the Buckets.js Bugs found by [Cosette] and [JaVerT 2.0]

Starting from the main Gillian folder, execute the following:

```bash
esy
esy init:env
cd Gillian-JS/environment
```

### [Cosette] Multi-Dictionary Bug

In order to reproduce the multi-dictionary bug reported by [\[Cosette\]](references.md#cosette-symbolic-execution-for-javascript), execute:

```bash
./testCosette.sh Examples/Cosette/Buckets/multidictionary/bug/multidictionary_bug.js
```

You will obtain a failing model

```
Assert failed with argument False.
Failing Model:
  [ (#x1: #x2) ]
```

The bug is caused by the library wrongly treating the case in which we try to remove a key-value pair for a key with no associated values. The code of the test is as follows:

```javascript
var dict = new buckets.MultiDictionary()

var s = symb_string(s);
var x1 = symb_number(x1);
var x2 = symb_number(x2);

dict.set(s, x1);
dict.set(s, x2);

dict.remove(s, x1);
var res = dict.remove(s, x2);
Assert(((not (x1 = x2)) and (res = true)) or ((x1 = x2) and (res = false)));
```

The test puts two symbolic numbers, `x1` and `x2` for the same symbolic key `s` into an empty multidictionary, then removes `x1`, and then removes `x2` and registers the value returned by `remove`. Then, it asserts that that value was `true` if the two keys were different, and `false` if the two keys were the same. What the failing model says is that, when the two keys are equal, the library, in fact, throws a native JavaScript error (indicated by the argument `False` of the failed assert).

### [JaVerT 2.0] Linked-List Bugs

In order to reproduce the linked-list bugs reported by [\[JaVerT 2.0\]](references.md#javert20-compositional-symbolic-execution-for-javascript), execute:

```bash
./testCosette.sh Examples/Cosette/Buckets/linkedlist/bug/linkedlist_bug_1.js
./testCosette.sh Examples/Cosette/Buckets/linkedlist/bug/linkedlist_bug_2.js
./testCosette.sh Examples/Cosette/Buckets/linkedlist/bug/linkedlist_bug_3.js
```

All of the bugs are caused by the library treating non-integer indexing incorrectly; we explain the bug found by the first test in detail, the remaining two are analogous. For the first test, the failing model is as follows:

```
Assert failed with argument
  ((((#x3 == 0) /\ (#x2 == #x1)) \/
    ((#x3 == 1) /\ (#x2 == #x2))) \/
    (((! (#x3 == 0)) /\ (! (#x3 == 1))) /\ (#x2 == undefined))).
Failing Model:
  [ (#x2: 4), (#x3: 0.5), (#x1: 3) ]
```

The code of the test is as follows:

```javascript
var list = new buckets.LinkedList()

var x1 = symb_number(x1);
var x2 = symb_number(x2);
var x3 = symb_number(x3);

list.add(x1)
list.add(x2)

var res = list.elementAtIndex(x3);
Assert( (((x3 = 0) and (res = x1)) or
         ((x3 = 1) and (res = x2))) or
         (((not (x3 = 0)) and (not (x3 = 1))) and (res = undefined)) );
```

The test inserts two symbolic numbers, `x1` and `x2`, into an empty linked list, and then indexes the list with a third symbolic number, `x3`. The expected outcome is that: if `x3 = 0`, the indexing returns `x1`; if `x3 = 1`, the indexing returns `x2`; and, otherwise, the indexing returns `undefined`. The failing model, however, says that if `x3 = 0.5`, the indexing will also return `x2`.

## Gillian-C (Section 4.2)

<!-- prettier-ignore-start -->
:::info
Folders marked with the (:x:PLDI20) annotation are out of scope for this submission.
:::
<!-- prettier-ignore-end -->

`Gillian-C` is the instantiation of Gillian to the C language. More precisely, to [CompCert-C](http://compcert.inria.fr/)). It can be found in the `Gillian-C` folder of the repository. Its implementation consists of the following:

- **Gillian-C**
  - `bin`: Source of the `gillian-c` executable.
  - `environment`: Execution environment, not part of the repository, created using `esy init:env`. It contains useful scripts for testing Gillian-C, and examples are copied in it so that they can be safely modified.
  - `examples`: Various examples.
    - `concrete`: Small data-structure examples for concrete execution.
    - `symbolic`: Small data-structure examples for symbolic testing.
    - `klee`: Same small data-structure examples as in `symbolic` but written for usage with KLEE.
    - `verification`: Small data-structure examples for verification mode (:x:PLDI20).
    - `act`: Small data-structure examples for Automatic Compositional Testing mode (:x:PLDI20).
  - `lib`: The core of Gillian-C.
    - `gilgen.ml/mli`: Compiler from C#m to GIL.
    - `gil_logic_gen.ml`, `annot_lexer.mll`, `annot_parser.mly`, `cLogic.ml`: Utils for handling a small annotation language for C (:x:PLDI20).
    - `valueTranslation.ml/mli`: Serialisation and deserialisation of CompCert values into GIL values.
    - `semantics.ml/mli`: Concrete and symbolic memory models.
    - `cRunner.ml`, `sRunner.ml`: Configuration for the symbolic and concrete bulk testers (`gillian-c bulk-wpst` and `gillian-c bulk-exec`).
    - Other files: Utilities such as name generators or configuration flags.
  - `runtime`: Implementation of the internals and part of the C standard lib in GIL.
  - `scripts`: Various scripts for setting up the environment and executing analyses.

### Writing Symbolic Tests

The whole-program symbolic testing aspect of Gillian-C is very similar to that of [KLEE](https://klee.github.io).

#### Declaring Symbolic Variables

In order to declare symbolic variables, we hijack the `__builtin_annot_intval` function of CompCert. A symbolic integer, for example, is declared in the following way:

```c
int a = __builtin_annot_intval("symb_int", a)
```

As Gillian-C is at an early stage, it is not yet possible to declare variables of symbolic size in memory. It is, however, possible to declare a symbolic string of fixed size by declaring all of its components one-by-one. For example, this is how you can define a one-element string:
```c
int a = __builtin_annot_intval("symb_int", a);
char c_a = (char) a;
char str_a[] = { c_a, '\0' };
```

#### Assumptions and Assertions

For any `C` boolean expression `e`, it is possible to state assumptions and assertions of the form:

```c
ASSUME(e);
ASSERT(e);
```

#### Semantics of Operators

In Gillian-C, unlike in Gillian-JS, the semantics of all of the operators in assumptions and assertions is that of C. What happens internally is that, first, the expression `e` is compiled to a sequence of commands (as C expressions can have side-effects but GIL expressions cannot).
The resulting GIL expression will then contain a <q>serialised C integer</q> (as `C` booleans are actually integers that have value 0 or 1).
A C integer is serialised in GIL as a two-element list of the form `{{ "int", x }}` where `x` is a GIL number.
`ASSUME` then calls the GIL state function `assume` in the form `assume(e = {{ "int", 1 }})`, which effectively means, given the semantics of GIL: <q>branch on the obtained boolean expression equalling `true` and cut the branch in which it is not</q>.
`ASSERT` works analogously, in that it calls the GIL state function `assert` instead of `assume`.

### Symbolic Testing of Collections-C

#### Test results

We symbolically test [Collections-C](https://github.com/srdja/Collections-C), a real-world C data-structure library for C.
The results are presented in the table below, with each row containing:

- The name of the folder being tested, which also indicates the data structure in question
- The number of tests
- The total number of GIL commands executed during these tests
- The total testing time in Gillian-C (in seconds)
- The total testing time in KLEE (in seconds)

|                  | **Tests** | **GIL Commands** | **Time(s)** | **KLEE Time(s)** |
|:----------------:|:---------:|:----------------:|:-----------:|:----------------:|
|    **array**     |    22     |     123,377      |    4.979    |      5.062       |
|    **deque**     |    34     |     186,627      |    5.383    |      5.515       |
|     **list**     |    37     |     478,773      |    7.420    |      6.875       |
|    **pqueue**    |     2     |      15,726      |    0.568    |      0.246       |
|    **queue**     |     4     |      39,478      |    0.474    |      0.463       |
| **ring\_buffer** |     3     |      27,284      |    0.236    |      0.319       |
|    **slist**     |    38     |     415,305      |    7.308    |      6.732       |
|    **stack**     |     2     |      5,211       |    0.216    |      0.208       |
|   **treeset**    |     6     |     108,583      |    1.800    |      2.430       |
|  **treetable**   |    13     |     162,608      |    3.396    |      3.380       |
|    **Total**     |    161    |    1,562,972     |   31.780    |      31.229      |

A detailed breakdown of the testing results is given below.

<!-- prettier-ignore-start -->
:::warning
The times given in the paper were incorrectly measured, both for Gillian-C and for KLEE.
For Gillian-C, our multi-threading mechanism was reporting completion time incorrectly, before all spawned threads terminated.
We have fixed this, and also improved the performance of our Gillian/Gillian-C symbolic engine.
For KLEE, we have only counted the user time reported by the `time` command.
We have consulted the KLEE development team in order to measure the times appropriately.
All KLEE times were obtained by running KLEE in a docker image on the same machine on which we tested Gillian-JS/Gillian-C, with no other applications open.

Additionally, we have simplified some of the tests (the coverage remains the same), resulting in a fewer number of executed GIL commands.

These new results are still consistent with the main claim of the paper: the performance of Gillian-C is comparable to that of KLEE.
:::
<!-- prettier-ignore-end -->

#### Resulting Fixes

The symbolic testing of Collections-C led to the following bug-fixing pull requests.
They fix previously unknown bugs and usage of undefined behaviours:
- [Fix buffer overflow](https://github.com/srdja/Collections-C/pull/119) (bug)
- [Remove the usage of cc_comp_ptr](https://github.com/srdja/Collections-C/pull/122) (undefined behaviour)
- [Test coincidentally passing while they should not](https://github.com/srdja/Collections-C/pull/123) (bugs and undefined behaviours)
- [Fix overallocation](https://github.com/srdja/Collections-C/pull/125) (bug)
- [Fix hashing function](https://github.com/srdja/Collections-C/pull/126) (performance-reducing bug)

#### Reproducing the Results
For licensing reasons, we cannot include the Collections-C code in the Gillian repository.
There is an [external repository](https://github.com/GillianPlatform/collections-c-for-gillian) that contains the Collections-C code adapted to testing in Gillian-C and KLEE.
In order to clone it, simply run, from the main Gillian folder:
```bash
cd ..
git clone https://github.com/GillianPlatform/collections-c-for-gillian.git collections-c
cd Gillian
```

There are two ways of launching the tests:
- Using the `bulk-wpst` command of Gillian-C which has a nicer output (using Rely), which only reports success/failure.
- Using a bash script that will call `gillian-c wpst` as many times as there are files to test, but supports multi-threading and command counting.

##### Using `bulk-wpst`

From the Gillian folder run:

```bash
esy x gillian-c bulk-wpst ../collections-c/for-gillian
```

You will see all of the test suites executing one by one. Two tests will fail, this is intended. They correspond to two of the bugs we have found and which are explained below.

##### Using the `bash` script

From the main Gillian folder, for each folder you would like to test, execute:
```bash
Gillian-C/scripts/testFolder.sh ../collections-c/for-gillian/[folder]
```

For example, to run the test suite related to singly-linked lists, execute:
```bash
Gillian-C/scripts/testFolder.sh ../collections-c/for-gillian/slist
```

As for Buckets.js, you can obtain the number of executed GIL commands for Collections-C by appending the `count` parameter to the testing command. For example, to count the number of executed commands for the singly-linked-list test suite, execute:

```bash
Gillian-C/scripts/testFolder.sh ../collections-c/for-gillian/slist count
```

##### Notes

1. The times obtained in the VM should be representative if run on a machine with a comparable specification (Intel Core i7-4980HQ CPU 2.80 GHz, DDR3 RAM 16GB, 256GB SSD) with no other applications running. Some (proportional) discrepancy is to be expected.
2. The times obtained when counting executed commands or using `bulk-wpst` will be slower, due to the fact that the tests will be run in single-threaded mode.

#### The array_test_remove.c buffer overflow bug

This test corresponds to [this](https://github.com/srdja/Collections-C/pull/119) pull request.
It is particularly interesting, as the original concrete test suite does not catch it, even with the appropriate values. Instead, it overflows, but does not fail. This is, therefore, a *security issue*. On the other hand, our symbolic memory model does not allow for buffer overflow, and the bug was caught.

#### The list_test_zipIterAdd.c flawed test

This test is also interesting, but for different reasons: the code that it is testing (the `list_zip_iter_add` function) does not contain any bugs, it is the test that is buggy, but it still passes.

In particular, the test adds two elements (`"h"` and `"i"`) in two separate lists at index 2. It then tests that the elements actually appeared at the second index of their respective lists, in the following way:

```c
list_index_of(list1, "h", zero_if_ptr_eq, &index);
CHECK_EQUAL_C_INT(2, index);

list_index_of(list1, "i", zero_if_ptr_eq, &index);
CHECK_EQUAL_C_INT(2, index);
```

However, note that both tests are executed on `list1`! What happened then is that `list_index_of` was not finding `"i"` in `list1` because it wasn't there, and therefore did not modify `index`. Since the first check was correct, the value of `index` was still `2` and the test passed anyway.

Our symbolic tests however, use symbolic 1-character strings, and assumes **the bare minimum about the input values** to make them pass, in order to explore as many possible paths as possible.

Here, we replaced every one-character strings `"X"` with one-character symbolic string `str_X`. For the test to pass, it should be *enough* for `str_h` to be different from every element in `list1` and for `str_i` to be different from every element in `list2`, and this is exactly what we assumed. However, we never assumed that `str_i` has to be different from every element in `list1` because this is not necessary for the test to pass.

However, here, the equality between every element of `list1` and `str_i` is tested. There is no indication as to the result of this equality, and so the execution branches. Therefore, there is a path created where `list_index_of(list1, str_i, zero_if_ptr_eq, &index)` will assign `0` to index, and the test will fail.

This shows how symbolic testing helps writing *more robust* tests.

#### Detailed Per-Folder Breakdown: Collections-C

|    **array**    | **add** | **addAt2** | **contains** | **deepCopy** | **getAt** | **indexOf** | **iterAdd** | **iterRemove** | **iterReplace** | **reduce** | **remove** | **removeAll** | **removeAt** | **replaceAt** | **reverse** | **shallowCopy** | **subarray** | **zipIterAdd** | **zipIterNext** | **zipIterRemove** | **zipIterReplace** | **Total** |
:---------------:|:-------:|:----------:|:------------:|:------------:|:---------:|:-----------:|:-----------:|:--------------:|:---------------:|:----------:|:----------:|:-------------:|:------------:|:-------------:|:-----------:|:---------------:|:------------:|:--------------:|:---------------:|:-----------------:|:------------------:|:--------:|
|**GIL Commands** |  1,779  |   1,198    |    4,122     |    3,104     |   1,794   |    1,953    |    4,419    |     3,452      |      4,158      |   3,195    |   22,373   |     6,686     |    2,011     |     1,721     |    2,033    |      2,500      |    3,021     |     16,832     |     14,301      |       8,660       |       14,065       |  123,377|
|    Time (s)     |  0.064  |   0.070    |    0.232     |    0.070     |   0.070   |    0.073    |    0.175    |     0.147      |      0.195      |   0.083    |   0.648    |     0.644     |    0.068     |     0.089     |    0.077    |      0.085      |    0.082     |     0.801      |      0.226      |       0.291       |       0.789        |   4.979|
|**KLEE Time(s)** |  0.066  |   0.095    |    0.183     |    0.104     |   0.099   |    0.092    |    0.178    |     0.152      |      0.162      |   0.094    |   0.373    |     0.293     |    0.116     |     0.114     |    0.094    |      0.115      |    0.097     |     0.961      |      0.186      |       0.437       |       1.051        |   5.062|

|    **deque**     | **addAt1** | **addAt2** | **addAt3** | **addAt4** | **addAt5** | **addFirst** | **addLast** | **bufferExpansion** | **capacity** | **contains** | **copyDeep** | **copyShallow** | **filter1** | **filter2** | **filter3** | **filterMut1** | **filterMut2** | **filterMut3** | **getAt** | **getFirst** | **getLast** | **iterAdd** | **iterNext** | **iterRemove** | **removeAll** | **removeFirst** | **removeLast** | **reverse** | **size** | **trimCapacity** | **zipIterAdd** | **zipIterNext** | **zipIterRemove** | **zipIterReplace** | **Total** |
|:----------------:|:----------:|:----------:|:----------:|:----------:|:----------:|:------------:|:-----------:|:-------------------:|:------------:|:------------:|:------------:|:---------------:|:-----------:|:-----------:|:-----------:|:--------------:|:--------------:|:--------------:|:---------:|:------------:|:-----------:|:-----------:|:------------:|:--------------:|:-------------:|:---------------:|:--------------:|:-----------:|:--------:|:----------------:|:--------------:|:---------------:|:-----------------:|:------------------:|:---------:|
| **GIL Commands** |   3,216    |   3,284    |   3,466    |   3,293    |   3,291    |    2,112     |    2,062    |        3,592        |    3,406     |    6,055     |    3,947     |      2,867      |    6,316    |    6,314    |    5,646    |     6,274      |     6,121      |     6,311      |   2,032   |    1,885     |    1,921    |    6,781    |    6,710     |     6,863      |     2,054     |      2,486      |     2,549      |    2,587    |  2,091   |      2,444       |     17,745     |     21,656      |      15,485       |       13,765       |  186,627  |
|   **Time(s)**    |   0.083    |   0.091    |   0.096    |   0.089    |   0.089    |    0.093     |    0.094    |        0.096        |    0.093     |    0.100     |    0.096     |      0.108      |    0.303    |    0.296    |    0.266    |     0.276      |     0.284      |     0.273      |  0..092   |    0.097     |    0.097    |    0.234    |    0.237     |     0.216      |     0.077     |      0.096      |     0.090      |    0.094    |  0.094   |      0.093       |     0.262      |      0.352      |       0.261       |       0.257        |   5.383   |
| **KLEE Time(s)** |   0.116    |   0.104    |   0.113    |   0.116    |   0.125    |    0.118     |    0.117    |        0.132        |    0.111     |    0.123     |    0.127     |      0.116      |    0.152    |    0.651    |    0.169    |     0.135      |     0.143      |     0.143      |   0.100   |    0.101     |    0.134    |    0.208    |    0.174     |     0.181      |     0.111     |      0.086      |     0.114      |    0.106    |  0.109   |      0.133       |     0.300      |      0.259      |       0.307       |       0.281        |   5.515   |

|     **list**     | **add** | **addAll** | **addAllAt** | **addAt** | **addFirst** | **addLast** | **contains** | **copyDeep** | **copyShallow** | **filter1** | **filter2** | **getAt** | **getLast** | **indexOf** | **iterAdd** | **iterDescAdd** | **iterDescRemove** | **iterRemove** | **mutFilter1** | **mutFilter2** | **new** | **remove** | **removeAll** | **removeAt** | **removeFirst** | **removeLast** | **replaceAt** | **reverse** | **splice** | **spliceAt** | **sublist** | **toArray** | **zipIterAdd** | **zipIterNext** | **zipIterRemove** | **zipIterReplace** | **Total** |
|:----------------:|:-------:|:----------:|:------------:|:---------:|:------------:|:-----------:|:------------:|:------------:|:---------------:|:-----------:|:-----------:|:---------:|:-----------:|:-----------:|:-----------:|:---------------:|:------------------:|:--------------:|:--------------:|:--------------:|:-------:|:----------:|:-------------:|:------------:|:---------------:|:--------------:|:-------------:|:-----------:|:----------:|:------------:|:-----------:|:-----------:|:--------------:|:---------------:|:-----------------:|:------------------:|:---------:|
| **GIL Commands** |  5,011  |   12,107   |    13,006    |   9,751   |    5,578     |    5,578    |    8,713     |    14,109    |     13,415      |    9,884    |   10,313    |   8,485   |    8,273    |    5,849    |   13,998    |     12,907      |       10,595       |     10,292     |     8,672      |     8,976      |  1,602  |   9,380    |     8,513     |    9,287     |      8,321      |     8,331      |     8,958     |   10,145    |   9,693    |    9,619     |   11,586    |   10,425    |     70,782     |     64,043      |      23,793       |       18,783       |  478,773  |
|   **Time(s)**    |  0.103  |   0.111    |    0.109     |   0.100   |    0.110     |    0.110    |    0.365     |    0.108     |      0.119      |    0.203    |    0.250    |   0.104   |    0.102    |    0.245    |    0.262    |      0.225      |       0.237        |     0.186      |     0.193      |     0.242      |  0.078  |   0.124    |     0.109     |    0.105     |      0.093      |     0.110      |     0.110     |    0.105    |   0.106    |    0.112     |    0.111    |    0.106    |     1.033      |      0.262      |       0.763       |       0.609        |   7.420   |
| **KLEE Time(s)** |  0.117  |   0.128    |    0.110     |   0.130   |    0.099     |    0.105    |    0.256     |    0.129     |      0.146      |    0.178    |    0.175    |   0.118   |    0.139    |    0.200    |    0.234    |      0.133      |       0.211        |     0.174      |     0.176      |     0.169      |  0.100  |   0.175    |     0.123     |    0.120     |      0.118      |     0.104      |     0.114     |    0.126    |   0.125    |    0.146     |    0.120    |    0.109    |     0.998      |      0.208      |       0.575       |       0.487        |   6.875   |

|    **pqueue**    | **enqueue** | **pop** | **Total** |
|:----------------:|:-----------:|:-------:|:---------:|
| **GIL Commands** |   10,684    |  5,042  |  15,726   |
|   **Time(s)**    |    0.278    |  0.290  |   0.568   |
| **KLEE Time(s)** |    0.118    |  0.128  |   0.246   |

|    **queue**     | **enqueue** | **iter** | **poll** | **zipIterNext** | **Total** |
|:----------------:|:-----------:|:--------:|:--------:|:---------------:|:---------:|
| **GIL Commands** |    4,268    |  5,736   |  4,799   |     24,675      |  39,478   |
|   **Time(s)**    |    0.075    |  0.082   |  0.081   |      0.236      |   0.474   |
| **KLEE Time(s)** |    0.104    |  0.087   |  0.102   |      0.169      |   0.463   |

| **ring\_buffer** | **capacity** | **enqueue** | **dequeue** | **Total** |
|:----------------:|:------------:|:-----------:|:-----------:|:---------:|
| **GIL Commands** |    8,361     |   10,495    |    8,428    |  27,284   |
|   **Time(s)**    |    0.084     |    0.077    |    0.075    |   0.236   |
| **KLEE Time(s)** |    0.105     |    0.103    |    0.111    |   0.319   |

|    **slist**     | **add** | **addAll** | **addAllAt** | **addAt** | **addFirst** | **addLast** | **contains** | **copyDeep** | **copyShallow** | **filter1** | **filter2** | **filter3** | **filterMut1** | **filterMut2** | **filterMut3** | **get** | **getFirst** | **getLast** | **indexOf** | **iterAdd** | **iterRemove** | **new** | **remove** | **removeAll** | **removeAt** | **removeFirst** | **removeLast** | **replaceAt** | **reverse** | **splice** | **spliceAt** | **sublist** | **toArray** | **zipIterAdd** | **zipIterNext** | **zipIterRemove** | **zipIterReplace** | **Total** |
|:----------------:|:-------:|:----------:|:------------:|:---------:|:------------:|:-----------:|:------------:|:------------:|:---------------:|:-----------:|:-----------:|:-----------:|:--------------:|:--------------:|:--------------:|:-------:|:------------:|:-----------:|:-----------:|:-----------:|:--------------:|:-------:|:----------:|:-------------:|:------------:|:---------------:|:--------------:|:-------------:|:-----------:|:----------:|:------------:|:-----------:|:-----------:|:--------------:|:---------------:|:-----------------:|:------------------:|:---------:|
| **GIL Commands** |  3,842  |   7,733    |    8,882     |   8,283   |    4,085     |    4,085    |    5,664     |    10,221    |      9,743      |    7,106    |    8,597    |   10,889    |     6,587      |     7,467      |     6,554      |  5,765  |    5,585     |    5,585    |    3,918    |   11,395    |     8,028      |  2,272  |   6,899    |     5,925     |    6,836     |      5,809      |     6,166      |     6,294     |    7,097    |   6,401    |    6,638     |    8,270    |    7,124    |     98,888     |     36,774      |      39,558       |       14,340       |  415,305  |
|   **Time(s)**    |  0.112  |   0.118    |    0.117     |   0.118   |    0.110     |    0.112    |    0.114     |    0.120     |      0.117      |    0.227    |    0.283    |    0.291    |     0.231      |     0.284      |     0.285      |  0.115  |    0.114     |    0.112    |    0.109    |    0.297    |     0.221      |  0.110  |   0.205    |     0.113     |    0.115     |      0.114      |     0.115      |     0.112     |    0.117    |   0.115    |    0.114     |    0.116    |    0.114    |     0.830      |      0.281      |       0.617       |       0.513        |   7.308   |
| **KLEE Time(s)** |  0.118  |   0.133    |    0.126     |   0.132   |    0.127     |    0.109    |    0.125     |    0.126     |      0.132      |    0.184    |    0.151    |    0.163    |     0.138      |     0.152      |     0.131      |  0.119  |    0.113     |    0.122    |    0.097    |    0.125    |     0.179      |  0.110  |   0.154    |     0.107     |    0.131     |      0.138      |     0.115      |     0.148     |    0.130    |   0.117    |    0.116     |    0.109    |    0.128    |     1.169      |      0.195      |       0.659       |       0.406        |   6.732   |

|    **stack**     | **pop** | **push** | **Total** |
|:----------------:|:-------:|:--------:|:---------:|
| **GIL Commands** |  2,539  |  2,672   |   5,211   |
|   **Time(s)**    |  0.109  |  0.107   |   0.216   |
| **KLEE Time(s)** |  0.105  |  0.103   |   0.208   |

|   **treeset**    | **add** | **iterNext** | **iterRemove** | **remove** | **removeAll** | **size** | **Total** |
|:----------------:|:-------:|:------------:|:--------------:|:----------:|:-------------:|:--------:|:---------:|
| **GIL Commands** | 18,586  |    9,195     |     31,648     |   19,323   |    18,625     |  11,206  |  108,583  |
|   **Time(s)**    |  0.287  |    0.347     |     0.293      |   0.290    |     0.292     |  0.291   |   1.800   |
| **KLEE Time(s)** |  0.458  |    0.462     |     0.402      |   0.434    |     0.349     |  0.325   |   2.430   |

|  **treetable**   | **add** | **get** | **getFirst** | **getGreaterThan** | **getLast** | **getLessThan** | **iterNext** | **iterRemove** | **remove** | **removeAll** | **removeFirst** | **removeLast** | **size** | **Total** |
|:----------------:|:-------:|:-------:|:------------:|:------------------:|:-----------:|:---------------:|:------------:|:--------------:|:----------:|:-------------:|:---------------:|:--------------:|:--------:|:---------:|
| **GIL Commands** | 29,759  |  9,511  |    5,800     |       6,228        |    5,734    |      6,193      |    9,252     |     7,876      |   25,949   |    27,219     |      6,481      |     7,291      |  15,315  |  162,608  |
|   **Time(s)**    |  0.356  |  0.205  |    0.231     |       0.229        |    0.236    |      0.225      |    0.331     |     0.248      |   0.280    |     0.283     |      0.224      |     0.274      |  0.274   |   3.396   |
| **KLEE Time(s)** |  0.474  |  0.158  |    0.192     |       0.182        |    0.192    |      0.182      |    0.368     |     0.225      |   0.384    |     0.293     |      0.193      |     0.221      |  0.316   |   3.380   |


## From Theory to Implementation

In the paper, the formalisation of GIL and the associated meta-theory is streamlined for clarity.
The implementation follows the same principles, but is, expectedly, more complex.
Here, we outline the main differences.


### GIL Syntax and Semantics

The syntax of GIL is defined in the paper on page 2, in the display box spanning lines 166-172.

We first focus on commands, which are defined in the implementation [in the `Cmd.ml` file](https://github.com/GillianPlatform/Gillian/blob/master/GillianCore/GIL_Syntax/Cmd.ml) as follows:

```ocaml
(* Cmd.ml *)
type 'label t =
  | Skip                                                                      (** Skip                              *)
  | Assignment    of string * Expr.t                                          (** Assignment                        *)
  | LAction       of string * string * Expr.t list                            (** Local Actions                     *)
  | Logic         of LCmd.t                                                   (** GIL Logic commands                *)
  | Goto          of 'label                                                   (** Unconditional goto                *)
  | GuardedGoto   of Expr.t * 'label * 'label                                 (** Conditional goto                  *)
  | Call          of
      string * Expr.t * Expr.t list * 'label option * logic_bindings_t option (** Procedure call                    *)
  | ECall         of string * Expr.t * Expr.t list * 'label option            (** External Procedure call           *)
  | Apply         of string * Expr.t * 'label option                          (** Application-style procedure call  *)
  | Arguments     of string                                                   (** Arguments of the current function *)
  | PhiAssignment of (string * Expr.t list) list                              (** PHI assignment                    *)
  | ReturnNormal                                                              (** Normal return                     *)
  | ReturnError                                                               (** Error return                      *)
  | Fail          of string * Expr.t list                                     (** Failure                           *)
```

The differences are as follows:

- The `Skip` command does nothing. It is useful as a collection point for PHI-nodes, see below.
- Action execution, `LAction (x, a, [e1, ..., en])` (corresponding to `x := a(e1, ..., en)`) takes multiple parameters instead of one, and actions themselves are represented as strings.
- There are two `goto commands`:
  - `Goto lab` that jumps unconditionally to the label `lab`; and
  - `GuardedGoto(e, lab1, lab2)` that jumps to `lab1` if `e` evaluates to `true` or to `lab2` if it evaluates to `false`
  The `ifgoto` presented in the paper is equivalent to these two commands.
- In the implementation, commands can be annotated with string labels (`string Cmd.t`); in the paper, they are assigned integer indexes (`int Cmd.t`).
  We write GIL programs with labeled commands for readability, and transpile to indexed commands for efficiency.
- In addition to the `return` (`ReturnNormal`) command, there is also a `throw` (`ReturnError`) command.
  This is because GIL execution has three modes in the implementation: normal, error, and failure.
  The error mode allows us to handle exceptions, but only clutters the meta-theory. For more details, see [JaVerT 2.0].
- The procedure call `Call(x, e, [e1, ..., en], lab)` (corresponding to `x := e(e1, ..., en) with lab`) takes multiple parameters instead of one, and,
  if the execution of the procedure terminates in error mode, the execution proceeds to the label `lab` automatically.
  The optional logical bindings are out of scope for this paper.
- We allow procedures to have a variable number of arguments using the `Apply` and `Arguments` commands.
  The `Apply(x, e, lab)` command, corresponding to `x := apply(e)`, expects `e` to be a GIL list, whose first element is the procedure name, and the remaining elements are the parameters with which the procedure is to be called. The `Arguments` command returns the list of parameters with which the procedure was called.
- The implementation also has an external call mechanism, `ECall`, that is currently used to model the `eval` statement in JavaScript, and could be used to model some system calls in Gillian-C. For more details, see [JaVerT 2.0].
- We have the multi-variable phi-assignment, `PhiAssignment`, that allows us to write programs in Single Static Assignment (SSA). JS-2-JSIL, for example, outputs code in SSA.
  For more details, see [JaVerT].
- The `Fail` command (`fail [desc] (e1, ..., en)`) can return multiple values and also carries a string that may contain an error name or error message.
- The `vanish` command of the paper has, incidentally, vanished. Instead, we have two higher-level commands, `assume` and `assert` in the [logic commands](https://github.com/GillianPlatform/Gillian/blob/master/GillianCore/GIL_Syntax/LCmd.ml), together with other logic commands that are out of scope of this paper. The `assume`/`assert` mechanism is equivalent to the `ifgoto-vanish/ifgoto-fail` mechanisms of the paper.
- The `uSym` and `iSym` commands are mainly theoretical devices that ensure soundness in the presence of fresh-value generation.
  In the implementation, we provide an allocation mechanism that allows the creators of Gillian instantations to generate fresh interpreted and uninterpreted symbols.
  They can then expose two dedicated actions corresponding to `uSym` and `iSym`.

The procedures and programs also contain more information than given in the paper:

```ocaml
type ('annot, 'label) proc = {
  proc_name : string;
  proc_body : ('annot * 'label option * 'label Cmd.t) array;
  proc_params : string list;
  proc_spec : Spec.t option;
}

type ('annot, 'label) prog = {
  imports : string list;
  lemmas : (string, Lemma.t) Hashtbl.t;
  preds : (string, Pred.t) Hashtbl.t;
  only_specs : (string, Spec.t) Hashtbl.t;
  procs : (string, ('annot, 'label) Proc.t) Hashtbl.t;
  macros : (string, Macro.t) Hashtbl.t;
  bi_specs : (string, BiSpec.t) Hashtbl.t;
  proc_names : string list;
  predecessors : (string * int * int, int) Hashtbl.t;
}
```

Procedures have a name, a body and parameters as described in the paper. However, each command in the body is also annotated with an opaque value that can be decided by the user (it has the `'annot` polymorphic type). These annotations can be used, for example, to hold information that helps error reporting, such as the line number of the command of the target language to which a given GIL line corresponds. Every command can also be attached to a label, that has the polymorphic type `'label`. Most often, we use `string` labels for labeled programs and `int` labels for indexed programs, as explained above. Finally, procedures can also have specifications that are used for verification and automatic compositional testing (out of scope).

Programs are not just maps from procedure identifiers to procedures, and additionally include, primarily, per-function verification-related information,
as well as a list of `imports` that need to be included on execution, the list of all procedure identifiers, and a table of predecessors required for
the PHI-assignment to work properly.

### Allocators

In the paper, allocators are defined near the end of page 3 (from line 320). They could be interpreted in terms of OCaml module signature as follows:

```ocaml
module type Allocator = sig
  type t    (** Type of allocation records    *)
  type us_t (** Type of uninterpreted symbols *)
  type is_t (** Type of interpreted symbols   *)

  val alloc_us : t -> int -> t * us_t
  val alloc_is : t -> int -> t * is_t
end
```

For efficiency, however, we chose to have this implementation:

```ocaml
(* Allocator.ml *)
module type S = sig
  type t                   (** Type of value to allocate *)

  val alloc : unit -> t    (** Allocation function *)
  val dealloc : t -> unit  (** Deallocation function *)
  val eq : t -> t -> bool  (** Equality of values to allocate *)
  val reset : unit -> unit (** Reset this allocator *)
end
```
The `dealloc` function allows for de-allocation of values.
The `reset` function is useful for bulk-testing; when running a new test, all allocators is reset.

The abstract location allocator (in [`ALoc.ml`](https://github.com/GillianPlatform/Gillian/blob/master/GillianCore/GIL_Syntax/ALoc.ml)), which corresponds to uninterpreted symbols, is then initialised as follows:
```ocaml
include Allocators.Make_with_prefix
          (Basic ())
          (struct
            let prefix = Names.aloc_
          end)
```

Where `Make_with_prefix` is a functor that takes:

- An abstract allocator `AL`, which produces values that can be stringified.
- A string prefix

and it returns an Allocator that allocates strings of the form `PREFIX_A` where `PREFIX` is the given prefix and `A` is the stringification of the value allocated by `AL`.

In the `ALoc` case, as the `AL` parameter, we use `Basic ()`, which instantiates an abstract allocator module that internally allocates integers. We show how allocators can be used in practice shortly.

### The State Model interface

In the paper, the state model interface is defined in line 208 and proper state models are defined in line 248 in terms of actions they must implement.
In the implementation, the interface of state models, available in [`State.ml`](https://github.com/GillianPlatform/Gillian/blob/master/GillianCore/engine/GeneralSemantics/State.ml) is slightly different and more complex. Most importantly, the actions are not infinite indexed families, and the index is normally the parameter of the action.

For example, the signature of expression evaluation, `eval_expr` is as follows:
```ocaml
val eval_expr : t -> Expr.t -> vt
```
Also, `setVar` is defined in terms of `setStore` and `getStore` directly by the interpreter:
```ocaml
let update_store (state : State.t) (x : string) (v : Val.t) : State.t =
    let store = State.get_store state in
    let _ = Store.put store x v in
    let state' = State.set_store state store in
    state'
```
Note that variables are treated as strings. Also note the usage of `Store.put`: stores have their own interface in the implementation, simplifying their usage.

The `execute_action` function defined in the state interface corresponds to the lifting of user-defined memory-model actions, as in line 212.
```ocaml
val execute_action : string -> t -> vt list -> action_ret

 type action_ret =
  | ASucc of (t * vt list)
  | AFail of err_t list
```
Note that, as above, actions are represented as strings. Action execution returns either a list of successful outcomes (pairs of states and lists of returned values) or error information, in case of failure. This error information is useful for automatic compositional testing.

Finally, the implemented state interface in the implementation exposes exposes many other functions important for the analysis. Some of them are used by the symbolic testing, but would only clutter the presentation, such as `assume_t` or `get_lvars`; others, such as `unify_assertion`, `produce_posts`, and `apply_fixes`, are useful either for the verification mode or the automatic compositional testing mode of Gillian, and are out of scope for this paper.

### The Memory Interfaces

Here is how Memory models are defined in the paper:
> **Definition** *(Concrete Memory Model)*: A concrete memory model, $M \in \mathbb{M}$, is a triple $\langle |M|, A, \underline{\mathsf{ea}}\rangle$, consisting of a set of concrete memories, $|M| \ni \mu$, a set of actions $A \ni \alpha$, and the action execution function $\underline{\mathsf{ea}} : A \rightarrow |M| \rightarrow \mathcal{V} \rightarrow \wp(|M| \times \mathcal{V})$, pretty-printed $\mu.\alpha(v) \rightsquigarrow (\mu', v)$.
>
> **Definition** *(Symbolic Memory Model)*: A symbolic memory model, $\hat M \in \mathbb{M}$, is a triple $\langle |\hat M|, A, \hat{\underline{\mathsf{ea}}}\rangle$, consisting of a set of symbolic memories, $|\hat M| \ni \hat \mu$, a set of actions $A \ni \alpha$, and the action execution function $\hat{\underline{\mathsf{ea}}} : A \rightarrow |\hat M| \rightarrow \hat \mathcal{E} \rightarrow \Pi \rightarrow \wp(|\hat M| \times \hat \mathcal{E} \times \Pi)$, pretty-printed $\hat \mu.\alpha(\hat e) \rightarrow (\mu', \hat e', \pi ')$.

In the implementation, Concrete Memory Models  and Symbolic Memory Models have an interface a bit more complex. The complete interface can be found in the files `GillianCore/engine/SymbolicSemantics/SMemory.ml` and `GillianCore/engine/ConcreteSemantics/CMemory.ml`.

These interfaces do export:
- `type t`, the type of memories, which correspond respectively to $|M|$ and $|\hat M|$
- `val execute_action: string -> t -> vt list -> action_ret` for the concrete memory models, which corresponds to the theoretical definition apart from the fact that actions are represented by their `string` name and that concrete actions can return an error, which is used for automatic compositional testing (out of scope here)
- `val execute_action: string -> t -> PFS.t -> TypeEnv.t -> vt list -> action_ret` for the symbolic memory models, which correspond to the theoretical definition apart from actions that are represented by their `string` names, the fact that the actions can return errors which are used for automatic compositional testing (out of scope here), and the path conditions ($\pi$) are split into two parts : `PFS.t` which are set of pure formulae and `TypeEnv.t` which are special kind of pure formulae corresponding to the type of values.

These interfaces export more definitions.
Since, for efficiency reasons, the type of memories can be mutable, the user must define an `init` function and a `copy` function. The user also has to define pretty printers for its state, which are used for the log files.

Finally, there are a lot of definitions (`ga_to_...`, `is_overlaping_asrt`, `assertions`, `mem_constraints`, `type err_t`, etc.) that are used either for verification or automatic compositional testing and are not presented in the PLDI20 paper because they are out of scope.








# References

- **[JaVerT]** José Fragoso Santos, Petar Maksimović, Daiva Naudžiūnienė, Thomas Wood, Philippa Gardner: JaVerT: JavaScript Verification Toolchain. PACMPL 2(POPL): 50:1-50:33 (2018)
- **[Cosette]** José Fragoso Santos, Petar Maksimović, Théotime Grohens, Julian Dolby, Philippa Gardner: Symbolic Execution for JavaScript. PPDP 2018: 11:1-11:14
- **[JaVerT 2.0]** José Fragoso Santos, Petar Maksimović, Gabriela Sampaio, Philippa Gardner: JaVerT 2.0: Compositional Symbolic Execution for JavaScript. PACMPL 3(POPL): 66:1-66:31 (2019)
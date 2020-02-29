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

We have initially tested JS-2-GIL successfully on the same 8797 tests and reported this in the submitted version of the paper. However, these tests were not systematically categorised and we were not able to automate the testing process to our satisfaction using the bulk testing mechanism of Gillian. For this reason, we have chosen to work with the latest version of Test262, forked [here](https://github.com/giltho/javert-test262), where each test comes with a precise description of its intended outcome. For example, a test that is supposed to fail at parsing time with a JavaScript native syntax error will contain the following in its header:

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

1. Clone our [forked Test262 repository](https://github.com/giltho/javert-test262) to a folder on your machine. Inside that folder, you can find the Test262 tests in the `test` subfolder. In particular, `test/language` contains the core language tests, whereas `test/built-ins` contains the tests for the built-in libraries.
2. To run all of the tests, execute the following command inside your Gillian folder:

```bash
esy
esy x javert bulk-exec [relative path to your Test262 folder]/test
```

For example, we normally clone Test262 in the same folder as the Gillian project and change its folder name from `javert-test262` to `test262`:

`git clone https://github.com/giltho/javert-test262.git test262`

We then run all of the tests by executing the following commands from within the main Gillian folder:

```bash
esy
esy x gillian-js test262 ../test262/test
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

The single parameters provided to these functions indicate the name of the created symbol, or _logical variable_, that Cosette will further use in the reaasoning. Normally, we choose these to coincide with the JavaScript variables in which they are stored so that the outputs of the analysis are more readable.

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

Importantly, the semantics of all of the operators is deliberately **NOT** as in JavaScript. For example, comparison and numeric operators do not perform any implicit type coercions. If you want to use JavaScript comparison/numeric operators, say `<=`, you can proceed as follows:

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

where `typeOf` is the built-in GIL typing operator and `Obj` is the built-in GIL object type. In this way, it is guaranteed that `x` is not an object (but may still equal `null`).

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

All of the bugs are causes by the library treating non-integer indexing incorrectly; we explain the bug found by the first test in detail, the remaining two are analogous. For the first test, the failing model is as follows:

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















# References

- **[JaVerT]** José Fragoso Santos, Petar Maksimović, Daiva Naudžiūnienė, Thomas Wood, Philippa Gardner: JaVerT: JavaScript Verification Toolchain. PACMPL 2(POPL): 50:1-50:33 (2018)
- **[Cosette]** José Fragoso Santos, Petar Maksimović, Théotime Grohens, Julian Dolby, Philippa Gardner: Symbolic Execution for JavaScript. PPDP 2018: 11:1-11:14
- **[JaVerT 2.0]** José Fragoso Santos, Petar Maksimović, Gabriela Sampaio, Philippa Gardner: JaVerT 2.0: Compositional Symbolic Execution for JavaScript. PACMPL 3(POPL): 66:1-66:31 (2019)
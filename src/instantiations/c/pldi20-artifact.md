# PLDI 2020 Artifact Documentation

This is the documentation for the Gillian-C aspect of the ['Gillian, Part I' PLDI 2020 submission](/publications/gillian1/) artifact.

## Folder structure

::: info
Folders marked with 🚫 are out of scope of the PLDI 2020 Gillian Paper.
:::

The relevant folders are located under the `Gillian-C/` directory:
- `bin/`: The Gillian-C binary
- `environment/`: Execution environment, not part of the repository, created using `make c-init-env`. It contains useful scripts for testing Gillian-C, and examples are copied in it so that they can be safely modified.
- `examples/`: Various example programs
  - `concrete/`: Small data structure examples for concrete testing
  - `symbolic/`: Small data structure examples for symbolic testing
  - `klee/`: The same examples from `symbolic/`, written for use with Klee
  - 🚫 `verification/`: Small data structure examples for verification mode
  - 🚫 `act/`: Small data structure examples for Automatic Compositional Testing mode
- `lib/../`: Gillian-C source code
  - `gilgen.ml` The Compiler from C to GIL
  - 🚫 `gil_logic_gen.ml`, `annot_lexer.mll`, `annot_parser.mly`, `cLogic.ml`: Utils for handling a small annotation language for C
  - `valueTranslation.ml`: Serialisation and deserialisation of CompCert values into GIL values
  - `semantics.ml`: Symbolic and concrete memory models for C
  - `cRunner.ml`, `sRunner.ml`: Configuration for the symbolic and concrete bulk testers (`gillian-c bulk-wpst` and `gillian-c bulk-exec`)
  - Other files: Utils such name generators or config flags
- `runtime/`: Implementation of Gillian-C's internals and part of the C standard lib in GIL
- `scripts/`: Various scripts for setting up the environment and executing analyses

## Symbolic testing

### Fixes

Symbolic testing with Collections-C led to the following pull requests, fixing previously unknown bugs and instances of undefined behaviour:
- [Fix buffer overflow](https://github.com/srdja/Collections-C/pull/119) (bug)
- [Remove the usage of `cc_comp_ptr`](https://github.com/srdja/Collections-C/pull/122) (undefined behaviour)
- [Test coincidentally passing while they should not](https://github.com/srdja/Collections-C/pull/123) (bugs and undefined behaviours)
- [Fix overallocation](https://github.com/srdja/Collections-C/pull/125) (bug)
- [Fix hashing function](https://github.com/srdja/Collections-C/pull/126) (performance-reducing bug)

### Reproducing the results
For licensing reasons, we do not include the Collections-C code in the Gillian repository. There is an [external repository](https://github.com/GillianPlatform/collections-c-for-gillian) that contains Collections-C code adapted for testing in Gillian-C and Klee.

To clone it, run these commands from the Gillian folder:
```bash
cd ..
git clone https://github.com/GillianPlatform/collections-c-for-gillian.git collection-c --branch PLDI20
cd Gillian
```

There are two ways to launch the tests:
- Using the `bulk-wpst` command of Gillian-C which has nicer output (using Rely), but cannot run the tests in parallel.
- Using a bash script that will run `gillian-c wpst` as many times as there are files to test, in parallel if desired (this is what we used in our measurements).

#### Using `bulk-wpst`
From the Gillian folder, run:
```bash
dune exec -- gillian-c bulk-wpst ../collections-c/for-gillian
```
You will see each test suite execute in sequence. Two tests will fail, as intended; they represent the two bugs described below.

#### Using the bash script
From the Gillian folder, for each folder you want to test, use:
```bash
Gillian-C/scripts/testFolder.sh ../collections-c/for-gillian/<folder>
```

For example, to run the test suite on singly-linked lists, run:
```bash
Gillian-C/scripts/testFolder.sh ../collections-c/for-gillian/slist
```

## Notable bugs found

### The `array_test_remove.c` buffer overflow bug
This test corresponds to [the 'Fix buffer overflow' pull request](https://github.com/srdja/Collections-C/pull/119). It is particularly interesting as the original test suite did not catch it. Interestingly, we expected a concrete test with the right values to catch it, but it could not; since our symbolic memory model cannot overflow, it caught the bug. This is because the buffer overflow didn't cause a failure, therefor indicating that this bug is a *security* issue.

### The `list_test_zipIterAdd.c` flawed test
This is interesting for different reasons; while the library code it tests (`list_zip_iter_add()`) does not contain a bug, *the test itself* contains a bug, yet passes anyway.

The test adds two elements (`"h"` and `"i"`) in two separate lists at index 2. It then tests that the elements actually appears at index 2 in the respective list, like so:
```bash
list_index_of(list1, "h", zero_if_ptr_eq, &index);
CHECK_EQUAL_C_INT(2, index);

list_index_of(list1, "i", zero_if_ptr_eq, &index);
CHECK_EQUAL_C_INT(2, index);
```

Notice that both tests are executed on `list`! Since `"i"` doesn't exist in `list1` and `list_index_of` couldn't find it, it therefore didn't modify `index`. Since the first check succeeded, the value of `index` is still `2` and the test passes regardless.

Our symbolic tests, however, use symbolic 1-character strings, and assume **the bare minimum information** about the input values to make them pass, in order to explore as many paths as possible.

Here, we replaced every one-character string `"X"` with a respective one-character symbolic string `str_X`. For the test to pass, it should be *enough* for `str_h` to be different from every element in `list1` and for `str_i` to be different from every element in `list2`; this is exactly what we assumed. However, we never assumed that `str_i` had to be different from every element in `list1` as it's not required for the test to pass.

However, here, the equality between every element of `list1` and `str_i` is tested. There is no indication as to the result of this test, so the execution branches. Therefore, there is a path created where `list_index_of(list1, str_i, zero_if_ptr_eq, &index)` will assign `0` to index, causing the test to fail.

This shows how symbolic testing can help write *more robust* tests.

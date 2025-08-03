# Symbolic Testing with Gillian-C
Gillian-C performs whole-program symbolic testing in a similar manner to [Klee](https://klee-se.org/).

## Declaring Symbolic Variables
In order to declare symbolic variables, we hijack the `__builtin_annot_intval` function of CompCert. A symbolic integer is declared like so:

```c
int a = __builtin_annot_intval("symb_int", a);
```

Gillian-C currently does not support declaring variables of undefined size.

You can declare a symbolic string of fixed size by declaring all its components one-by-one. For example, a string containing one character can be declared like so:

```c
int a = __builtin_annot_intval("symb_int", a);
ASSUME(-128 <= a); ASSUME (a <= 127);
char c_a = (char) a;
char str_a[] = { c_a, '\0' };
```

## Assumptions and Assertions
For any C boolean expression `e`, you can write:
```c
ASSUME(e);
ASSERT(e);
```
The expression `e` is compiled to commands (as C expressions can have side effects, but GIL expressions cannot). Then, a final GIL expression will contain a "serialised C integer" (as C booleans are actually integers with value `0` or `1`). A serialised C integer is a list of the form `{{ "int", x }}` where `x` is a GIL number. `ASSUME` will call the internal GIL `assume` in the form `assume(e = {{ "int", 1 }})`, which means "check that the obtained boolean expression is true", otherwise cut the branch. `ASSERT` does the same, but with the GIL `assert` instead.

As opposed to Gillian-JS, we use C expressions directly, instead of custom expressions, allowing one to use the same C syntax when writing tests. However, this causes execution to branch more, though `ASSUME` will then cut branches we don't want.
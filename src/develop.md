# Developing Gillian

## Executing a command in the test environment
`dune` lets you execute a command in an execution environment where all built binaries and installed files are correctly added to your path. Gillian-JS, Gillian-C and WISL must be executed in this environment to work correctly and find their runtime files.

To run any command under this environment:
```bash
dune exec -- <command>
```

To access the different manuals, you can use:
```bash
dune exec -- wisl --help
dune exec -- gillian-c --help
dune exec -- gillian-js --help
```

You can even get more precise help about specific commands, for example:
```bash
dune exec -- gillian-js verify --help
```

## Rebuilding after modifications
A Makefile is provided to simplify command tasks; you can rebuild the project by simply running:
```bash
make
```

You can automatically rebuild on changes by running
```bash
make watch
```

## Code style
You can automatically format the code by running
```bash
dune fmt
```

It's recommended that you install the provided git hooks (by running `githooks/install.ml` to enforce code style).

We advise using [the _intf trick](https://www.craigfe.io/posts/the-intf-trick) where appropriate to avoid code duplication.

When you have a function that returns an `option`, and an extension-raising equivalent, you should name them `foo` and `foo_exn` respectively, *not* `foo_opt` and `foo`.

A rule of thumb for choosing whether to make a function argument labelled: is the argument's purpose obvious from its type and the name of the function? If not, it should be labelled.

```ocaml
(* This doesn't need labels *)
val use_query: database -> query -> query_result

(* Wait, what's this weird first argument? Better make it labeled *)
val use_query: (string -> string) -> database -> query -> query_result

(* These arguments have the same type - how do I know which one is which? *)
val copy_content: channel -> channel -> unit

(* This is better *)
val copy_content : in:channel -> out:channel -> unit
```

## Documentation

Gillian's API reference is generated with `odoc`.

This documentation is built with [VitePress](https://vitepress.dev), and its source can be found at [`GillianPlatform/gillian-docs`](https://github.com/GillianPlatform/gillian-docs).

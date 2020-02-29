---
id: pldi20-diff
title: "Differences between Paper and Implementation"
---

:::info
The information contained in the section is valid for the version Gillian that is tagged `pldi-20`. The implementation may change in the future and implementation might get further away or closer to what the paper says in the future.
:::

This page describes how **Petar** will write this sentence himself.


## The GIL Syntax

Here is how the paper defines the GIL syntax:

>$$
>\begin{array}{lcl}
>v \in \mathcal{V} & \triangleq & n \in \mathcal{N} \mid s \in \mathcal{S} \mid b \in \mathcal{B} \mid l, \varsigma \in \mathcal{U} \mid \tau \in \mathcal{T} \mid f \in \mathcal{F} \mid \bar v \\
>e \in \mathcal{E} & \triangleq & v \mid x \in \mathcal{X} \mid \ominus e \mid e_1 \oplus e_2\\
>c \in \mathcal{C}_A & \triangleq & x := e \mid \mathsf{ifgoto} e i \mid x := e(e') \mid \mathsf{return}\ e \mid \mathsf{fail}\ e \\
>                    &            & \mid \mathsf{vanish} \mid x := \alpha(e) \mid x := \mathsf{uSym}_j \mid x := \mathsf{iSym}_j \\
>proc \in \mathcal{P}roc_A & \triangleq & \mathsf{proc}\ f(x)\{\bar c\}\\
>\mathsf p \in \mathcal{P}rog_A & : & \mathcal{F} \rightharpoonup \mathcal{P}roc_A
>\end{array}
>$$

The actual implentation of GIL slightly differs from this.

### Commands

Let us start by focusing on commands, here is how commands are defined in the implementation:

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
  | ReturnError                                                               (** Error return        *)
  | Fail          of string * Expr.t list                                     (** Failure             *)
```


The assignment is as described in the paper. There is an additional `Skip` command, that does nothing.

In action call, `LAction(x, a, el)`, `x` is the variable name the result is going to be assigned to, `a` is the name of the action and `el` is a *list* of parameters. Like function calls, the paper presents a simplified version where actions can only take one parameter. Moreover, there is not `action` type, but actions are denoted by their name which is a string.

Instead of an `ifgoto e i` command there are two commands :
- `goto lab` that jumps to label `lab`
- `goto [e] lab1 lab2` that jumps either to `lab1` or to `lab2` depending on the boolean `e` evaluates to
Note that using `ifgoto` or these two kinds of gotos is equivalent. Moreover, in the implementation, the type of labels is polymorphic. `string Cmd.t` corresponds to "labeled commands", meaning one can annotate commands with string labels. `int Cmd.t` corresponds to "indexed commands", meaning `goto j` jumps the the `j`-th command of the current procedure. We write GIL programs with labeled commands for readability, and translate to indexed commands for efficiency.

There is an additional `Argument` command that returns the list of arguments given to the current procedure, and a `PhiAssignment` that can be used for Static Single Assignment style programming.

The implementation of GIL comes with a better treatment of errors. There are two return commands:
- `ReturnNormal`
- `ReturnError`
In both cases, the value returned is the one contained in the special `"ret"` variable. Both command return as explained in the paper, in an intuitive way, but they set the return mode either in `Normal` mode or in `Error` mode. If the function returns in `Normal` mode, the program execution continues normally, otherwise, it depends on how the function was called.

Let us take a closer look at the `Call` command, and describe the 5 arguments of `Call(x, f, el, lab_opt, bindings)`.
- `x` is the name of the variable in which the result will be stored
- `f` is the expression that should resolve to the procedure identifier (a string)
- `el` is the list of expressions passed as arguments to the procedure
- `lab_opt` is an optional label to which the execution will jump if the called procedure returns in `Error` mode.
- Some logic bindings that are useful for verification, but out of scope for the PLDI-2020 paper

`Fail` is very similar to the `fail` command described in the paper: it terminates the execution of the entire program in failure mode. However, it takes an additional parameter to the "failing value", which is a string that contains an error name or error message.

The implementation also has an external call mechanism (`ECall`) that is used to model `eval` in JavaScript, and could be used to model some system calls in Gillian-C.

`Apply` is an application-style procedure calls. It takes only one expression as parameter, which should evaluate to the list of argument that will be passed to the procedure.

There are `Logic` commands, such as `Assume` or `Assert`. But there are also more kinds of logic commands that are used for the verification mode of Gillian.

Finally the paper describes three more kinds of commands that are not in the implementation. The first one is `vanish` that is trivially replaced by `Assume False` in the implementation. Then there is `uSym` and `iSym` the **Petar** will explain much better than I do.

### Procedures and programs

As explained earlier, there is no defined set `A` of actions, actions are denotted by their name, a string. Also, the procedures and programs contain much more information than what is in the paper.

```ocaml
type ('annot, 'label) proc = {
  proc_name : string;
  proc_body : ('annot * 'label option * 'label Cmd.t) array;
  proc_params : string list;
  proc_spec : Spec.t option;
}

type ('annot, 'label) prog = {
  imports : string list;
  (* lemmas : (string, Lemma.t) Hashtbl.t; *)
  (* preds : (string, Pred.t) Hashtbl.t; *)
  (* only_specs : (string, Spec.t) Hashtbl.t; *)
  (* procs : (string, ('annot, 'label) Proc.t) Hashtbl.t; *)
  macros : (string, Macro.t) Hashtbl.t;
  (* bi_specs : (string, BiSpec.t) Hashtbl.t; *)
  (* proc_names : string list; *)
  predecessors : (string * int * int, int) Hashtbl.t;
}
```

Procedures have a name, a body and parameters as described in the paper. However, each command in the body is also annotated with something that is can be decided by the used (it has the `'annot` polymorphic type. These annotations can be used to understand keep information during execution that helps understanding the result of an analysis. Every command is also attached to a label, that has polymorphic type `'label`. Most often, we use `string` labels for labeled programs and `int` labels for labeled programs as explained above. Finally, procedures can also have specifications that are used for verification but are out of scope for the PLDI2020 paper.

Programs are not just a map from procedure identifiers to procedures. There are also:
- `lemmas`, `predicates` and `specifications` that are used for verification (out of scope her)
- `bi_specs` which are precomputed hints for automatic compositional testing
- `macros` which are used to define syntactic sugar over lists of logic commands, useful for readability, and unfolded at execution time
- A `predecessors` table used for the Phi Assignment


## The Memory Interfaces



## Allocators


<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.11.0/dist/katex.min.css"
  integrity="sha384-BdGj8xC2eZkQaxoQ8nSLefg4AV4/AwB3Fj+8SUSo7pnKP6Eoy18liIKTPn9oBYNG"
  crossOrigin="anonymous"
/>

In the paper allocators have the following definition:

> An allocator $AL \in \mathbb{A}\mathbb{L}$ is a triple $\langle|AL|, \mathsf Y, \mathsf{alloc}\rangle$, consisting of: **(1)** a set $|AL|\ni \xi$ of allocation records; **(2)** a set $Y$ of all values that are allowed to be allocated; and **(3)** an allocation function:
>$$
>\mathsf{alloc}: |AL| \rightarrow \mathbb{N} \rightarrow \wp(\mathsf Y) \rightharpoonup |AL|\times V
>$$
>pretty-printed as $\xi.\mathsf{alloc}(j)\rightharpoonup_{\mathsf Y}(\xi', y)$, which takes an allocation record $\xi$, a, allocation site $j$, and an allocation range $Y \subseteq \mathsf Y$, and returns a fresh value $y \in Y$, together with the appropriately updated allocation record $\xi'$.
>
>Intuitively, an allocation record maintains information about already allocated values. This apporach is complementary to [the free set approach](https://doi.org/10.1007/978-3-540-78499-9_15), where information is maintained about values that can still be allocated. An allocation site $j$ is the program point associated with either the $\mathsf{uSym}_j$ or the $\mathsf{iSym}_j$ command.

This could be interpreted in terms of OCaml module signature as:

```ocaml
module type Allocator = sig
  type t    (** Type of allocation records     *)
  type us_t (** Type of uninterpreted symbols **)
  type is_t (**  Type of interpreted symbols   *)

  val alloc_us : t -> int -> t * us_t
  val alloc_is : t -> int -> t * is_t
end
```

However, for efficiency, we chose this implementation:

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
The `reset` function is useful for bulk-testing. When running a new test, every allocator is reset.

The Abstract location allocator (in `ALoc.ml`), which corresponds to uninterpreted symbols, are then initiated like this:
```ocaml
include Allocators.Make_with_prefix
          (Basic ())
          (struct
            let prefix = Names.aloc_
          end)
```

Where `Make_with_prefix` is a functor that takes:
- An abstract Allocator `AL` that produces values which can be stringified.
- A string prefix

and it returns an Allocator that allocates strings of the form `PREFIX_A` where `PREFIX` is the given prefix and `A` is a stringification of the allocated by `AL`. 

In this case, as the `AL` parameter, we use `Basic ()` which instantiates an abstract allocator module that internally just allocates integers.



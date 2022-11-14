const jose = "José Fragoso Santos";
const petar = "Petar Maksimović";
const gaby = "Gabriela Sampaio";
const sacha = "Sacha-Élie Ayoun";
const philippa = "Philippa Gardner";
const thomas = "Thomas Wood";
const daiva = "Daiva Naudžiūnienė";

export type PubRef = {
  title: string;
  authors: string[];
  abstract_: string;
  venue: string;
  date: string;
  identifier: {
    [key: string]: {
      name: string;
      link: string;
    };
  };
};

export const gillianPartI = {
  title:
    "Gillian, Part I: Parametric Symbolic Execution for Real-World Programming Languages",
  authors: [jose, petar, sacha, philippa],
  abstract:
    "We introduce Gillian, a language-independent framework for the development of symbolic analysis tools. Gillian supports whole-program symbolic testing, semi-automatic verification, and automatic compositional testing using bi-abduction. It comes with meta-theoretical results that are parametric on the memory model of the target language and a modular implementation that closely follows the meta-theory, all designed to minimise the instantiation effort of the user. In this paper, we focus on the parametric symbolic execution engine at the core of Gillian and its associated meta-theory. We instantiate Gillian to obtain symbolic testing tools for JavaScript and C, and use these tools to find bugs in real-world code, with times that either outperform or are competitive with the existing language-specific tools.",
  venue:
    "PLDI 2020: Proceedings of the 41st ACM SIGPLAN Conference on Programming Language Design and Implementation",
  date: "June 2020",
  identifiers: {
    doi: {
      name: "10.1145/3385412.3386014",
      link: "https://doi.org/10.1145/3385412.3386014",
    },
  },
};

export const gillianPartII = {
  title: "Gillian, Part II: Real-World Verification for JavaScript and C",
  authors: [petar, sacha, jose, philippa],
  abstract:
    "We introduce verification based on separation logic to Gillian, a multi-language platform for the development of symbolic analysis tools which is parametric on the memory model of the target language. Our work develops a methodology for constructing compositional memory models for Gillian, leading to a unified presentation of the JavaScript and C memory models. We verify the JavaScript and C implementations of the AWS Encryption SDK message header deserialisation module, specifically designing common abstractions used for both verification tasks, and find two bugs in the JavaScript and three bugs in the C implementation.",
  date: "July 2021",
  venu: "CAV 2021: International Conference on Computer Aided Verification",
  identifiers: {
    doi: {
      name: "10.1007/978-3-030-81688-9_38",
      link: "https://doi.org/doi:10.1007/978-3-030-81688-9_38",
    },
  },
};

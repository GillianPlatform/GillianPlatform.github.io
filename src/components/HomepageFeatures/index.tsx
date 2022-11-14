import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "GIL: General Intermediate Language",
    Svg: require("@site/static/img/undraw_fitting_piece.svg").default,
    description: (
      <>
        Gillian uses an intermediate language called GIL. GIL is a simple goto
        language parametric on the <code>basic actions</code>
        of the memory model of the target language.
      </>
    ),
  },
  {
    title: "Focus on what matters",
    Svg: require("@site/static/img/undraw_annotation.svg").default,
    description: (
      <>
        Give Gillian a compiler from your target language (TL) to GIL and an
        OCaml implementation of the TL symbolic memory model, and obtain several
        powerful symbolic analysis tools in return.
      </>
    ),
  },
  {
    title: "Minimal proof effort",
    Svg: require("@site/static/img/undraw_proof.svg").default,
    description: (
      <>
        Gillian comes with parametric correctness results, meaning that you only
        need to prove correct what you implement, nothing more.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

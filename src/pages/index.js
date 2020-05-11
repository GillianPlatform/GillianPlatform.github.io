import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>GIL: General Intermediate Language</>,
    imageUrl: 'img/undraw_fitting_piece.svg',
    description: (
      <>
        Gillian uses an intermediate language called GIL. GIL is
        a simple goto language parametric on the <code>basic actions</code>
        of the memory model of the target language.
      </>
    ),
  },
  {
    title: <>Focus on what matters</>,
    imageUrl: 'img/undraw_annotation.svg',
    description: (
      <>
        Give Gillian a compiler from your target language (TL) to GIL and an
        OCaml implementation of the TL symbolic memory model, and obtain
        several powerful symbolic analysis tools in return.
      </>
    ),
  },
  {
    title: <>Minimal proof effort</>,
    imageUrl: 'img/undraw_proof.svg',
    description: (
      <>
        Gillian comes with parametric correctness results, meaning that
        you only need to prove correct what you implement, nothing more.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  let imgUrl = 'img/logo.svg';
  const logoUrl = useBaseUrl(imgUrl);
  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="Documentation of the Gillian Platform.">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">
            <img className="logo_title" src={logoUrl} />
            Gillian
          </h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/start')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;

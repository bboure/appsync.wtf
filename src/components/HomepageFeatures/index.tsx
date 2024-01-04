import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
  button?: {
    label: string;
    to: string;
  };
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Tutorials, Guides & Courses',
    Svg: require('@site/static/img/learn.svg').default,
    description: (
      <>
        Learn AWS AppSync from experts. We have tutorials, guides and courses to
        help you get started.
      </>
    ),
    button: {
      label: 'Learn',
      to: '/resources/learn/tutorials',
    },
  },
  {
    title: 'Tools & Libraries',
    Svg: require('@site/static/img/libraries.svg').default,
    description: (
      <>
        Make the best out of AWS AppSync with community based tools and
        libraries.
      </>
    ),
    button: {
      label: 'Explore',
      to: '/resources/tooling',
    },
  },
  {
    title: 'Powered by the community',
    Svg: require('@site/static/img/community.svg').default,
    description: (
      <>
        This website is powered by the community. Contribute to this website by
        submitting a pull request on{' '}
        <a href="https://github.com/bboure/appsync.wtf">GitHub</a>.
      </>
    ),
    button: {
      label: 'Contribute',
      to: 'https://github.com/bboure/appsync.wtf',
    },
  },
];

function Feature({ title, Svg, description, button }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        {button && (
          <p>
            <Link className="button button--primary" to={button.to}>
              {button.label}
            </Link>
          </p>
        )}
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

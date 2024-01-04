import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

type Props = {
  buttonText?: string;
  items: Item[];
};

type Item = {
  title: string;
  description: JSX.Element;
  url: string;
};

export default function (props: Props): JSX.Element {
  const { items, buttonText } = props;

  return (
    <section>
      <div className="container">
        {items.map((item, idx) => {
          const { title, description, url } = item;
          return (
            <div key={idx}>
              <div className="padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <div>
                  <p>{description}</p>
                  <p>
                    <Link className="button button--primary" to={url}>
                      {buttonText || 'Go'}
                    </Link>
                  </p>
                </div>
              </div>
              <hr />
            </div>
          );
        })}
      </div>
    </section>
  );
}

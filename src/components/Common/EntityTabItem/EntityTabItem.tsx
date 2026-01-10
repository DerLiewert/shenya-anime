import { Link } from 'react-router-dom';
import { getImageUrl } from '@/utils';
import { JikanImages } from '@/typescript';
import './EntityTabItem.scss';

type TextItem = { prefix: string; text: string } | string;

interface EntityTabItemProps {
  images: JikanImages;
  title: string;
  subtitles?: TextItem[];
  bottomText?: TextItem[];
  linkUrl?: string;
}

export const EntityTabItem = ({
  images,
  title,
  subtitles = [],
  bottomText = [],
  linkUrl,
}: EntityTabItemProps) => {
  const renderEntityText = (items: TextItem[]) => {
    return items.map((item, index) => (
      <p key={index}>
        {typeof item === 'string' ? (
          item
        ) : (
          <>
            {item.prefix}: <span>{item.text}</span>
          </>
        )}
      </p>
    ));
  };

  const renderItemContent = () => (
    <>
      <div className="entity-item__image bg bg--dark">
        <img src={getImageUrl(images)} alt="Poster" loading="lazy" aria-hidden />
      </div>
      <div className="entity-item__content">
        <h3 className="entity-item__title title visible-line">{title}</h3>

        {subtitles.length > 0 && (
          <div className="entity-item__subtitle">{renderEntityText(subtitles)}</div>
        )}

        {bottomText.length > 0 && (
          <div className="entity-item__bottom-text">{renderEntityText(bottomText)}</div>
        )}
      </div>
    </>
  );

  if (linkUrl)
    return (
      <Link to={linkUrl} className="entity-item border">
        {renderItemContent()}
      </Link>
    );

  return <div className="entity-item border">{renderItemContent()}</div>;
};

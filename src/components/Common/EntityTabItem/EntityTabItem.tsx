import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/utils';
import type { JikanImages } from '@/models';
import './EntityTabItem.scss';

type TextWithPrefix = {
  prefix: string;
  text: string;
};

interface EntityTabItemProps {
  images: JikanImages;
  title: string;
  subtitles?: Array<string | TextWithPrefix>;
  bottomText?: Array<string | TextWithPrefix>;
  linkUrl?: string;
}

const EntityTabItem: React.FC<EntityTabItemProps> = ({
  images,
  title,
  subtitles,
  bottomText,
  linkUrl,
}) => {
  const renderEntityText = (items: Array<string | TextWithPrefix>) => {
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

        {subtitles && subtitles.length > 0 && (
          <div className="entity-item__subtitle">{renderEntityText(subtitles)}</div>
        )}

        {bottomText && bottomText.length > 0 && (
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

export default EntityTabItem;

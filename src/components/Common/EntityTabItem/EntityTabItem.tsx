import React from 'react';
import { Link } from 'react-router-dom';
import type { JikanImages } from '@/models';
import './EntityTabItem.scss';
import { getImageUrl } from '@/utils';

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
  const renderItemContent = () => (
    <>
      <div className="entity-item__image bg bg--dark">
        <img src={getImageUrl(images)} alt="*" loading="lazy" aria-hidden />
      </div>
      <div className="entity-item__content">
        <h3 className="entity-item__title title visible-line">{title}</h3>

        {subtitles && subtitles?.length > 0 && (
          <div className="entity-item__subtitle">
            {subtitles.map((item, index) => (
              <p key={index}>
                {typeof item === 'string' ? (
                  item
                ) : (
                  <>
                    {item.prefix}: <span>{item.text}</span>
                  </>
                )}
              </p>
            ))}
          </div>
        )}

        {bottomText && bottomText?.length > 0 && (
          <div className="entity-item__bottom-text">
            {bottomText.map((item, index) => (
              <p key={index}>
                {typeof item === 'string' ? (
                  item
                ) : (
                  <>
                    {item.prefix}: <span>{item.text}</span>
                  </>
                )}
              </p>
            ))}
          </div>
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

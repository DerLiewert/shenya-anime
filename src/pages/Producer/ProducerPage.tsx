import React from 'react';
import BG from '@/assets/people-bg.jpg';
import { ProducerFull } from '@/models';
import { fetchProducerFullById } from '@/store/producer/producerFullByIdSlice';
import { ProducerAboutTab, EntityPageLayout } from '@/components';
import { appPaths } from '@/resources';
import './ProducerPage.scss';

const ProducerPage = () => {
  return (
    <EntityPageLayout<ProducerFull>
      fetchAction={fetchProducerFullById}
      selector={(state) => state.producerFullById.item}
      status={(state) => state.producerFullById.status}
      getBasePath={(id) => appPaths.producerFull(id)}
      introBg={BG}
      render={(item) => ({
        title: item && item.titles[0]?.title,
        subtitles: item && item.titles[1] ? [item.titles[1].title] : [],
        resources: item && <ProducerResources item={item} />,
        tabs: item
          ? [
              {
                value: 'about',
                label: 'About',
                element: <ProducerAboutTab item={item} />,
              },
            ]
          : [],
      })}
    />
  );
};
export default ProducerPage;

/* =====================
 === ProducerResources ===
===================== */
const ProducerResources: React.FC<{ item: ProducerFull }> = ({ item }) => {
  const resources = item && item.external ? item.external : [];

  return (
    <div className="full-page-leftside__resources border-radius">
      <div className="full-page-leftside__item">
        <h4 className="full-page-leftside__title">{'External links'}</h4>
        <ul className="full-page-leftside__list leftside-list">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <li key={resource.url} className="leftside-list__item leftside-list__item--icon">
                <a
                  href={resource.url}
                  className="leftside-list__link"
                  target="_blank"
                  rel="noopener noreferrer">
                  {resource.name}
                </a>
              </li>
            ))
          ) : (
            <li className="leftside-list__item">Not any resources</li>
          )}
        </ul>
      </div>
    </div>
  );
};

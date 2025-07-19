import React from 'react';
import Tippy from '@tippyjs/react';
import { useMediaQuery } from 'react-responsive';

interface TooltipWrapperProps {
  content: React.ReactElement;
  children: React.ReactElement;
  onShowTippy: () => void
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ content, children, onShowTippy }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767.98px)' });
  return (
    <Tippy
      content={content}
      visible={isMobile ? false : undefined}
      placement="right-start"
      theme="custom"
      interactive={true}
      appendTo={document.body}
      duration={300}
      delay={600}
      animation="fade-smooth"
      onShow={onShowTippy}
      popperOptions={{
        modifiers: [
          {
            name: 'eventListeners',
            options: {
              scroll: false,
              resize: false,
            },
          },
        ],
      }}>
      {children}
    </Tippy>
  );
};

export default TooltipWrapper;

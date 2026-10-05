import React from 'react';
import { InfoButton } from './InfoButton';

interface InfoTooltipProps {
  content: string;
  size?: 'sm' | 'md';
  className?: string;
  title?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  size = 'sm',
  className = '',
  title = 'Information'
}) => {
  return (
    <InfoButton
      content={content}
      title={title}
      size={size}
      className={className}
    />
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons';

export interface IconedRouteLinkProps {
  title?: string;
  icon: IconType;
  url: string;
}

const IconedRouteLink: React.FC<IconedRouteLinkProps> = ({ title, url, icon: Icon }) => {
  return (
    <Link to={url} className='flex flex-col items-center justify-center w-24 h-24'>
      <Icon size={40} />
      <span>{title}</span>
    </Link>
  )
}

export default IconedRouteLink;
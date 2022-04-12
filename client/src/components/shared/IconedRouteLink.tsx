import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { IconType } from 'react-icons';

export interface IconedRouteLinkProps {
  title?: string;
  icon: IconType;
  url: string;
  activeClass?: string;
}

const IconedRouteLink: React.FC<IconedRouteLinkProps> = ({ title, url, icon: Icon, activeClass }) => {

  const content = (<>
    <Icon size={40} />
    <span>{title}</span>
  </>);


  if(activeClass) {
    return (
      <NavLink 
        to={url} 
        className={({ isActive }) => isActive 
          ? 'flex flex-col items-center justify-center w-24 h-24 ' + activeClass
          : 'flex flex-col items-center justify-center w-24 h-24'
        }
      >
        {content}
      </NavLink>
    )
  }
  else {
    return (
      <Link to={url} className='flex flex-col items-center justify-center w-24 h-24'>
        {content}
      </Link>
    )
  }
}

export default IconedRouteLink;
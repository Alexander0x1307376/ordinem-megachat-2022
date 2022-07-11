import React, { MouseEvent } from "react";
import { NavLink, NavLinkProps, useNavigate } from "react-router-dom";
import { useLongPress } from 'use-long-press';


export interface NavLinkWithOptionsProps {
  link: string;
  onLongPress?: () => void;
  className: NavLinkProps['className'];
}

const NavLinkWithOptions: React.FC<NavLinkWithOptionsProps> = ({
  link, children, onLongPress, className
}) => {

  const navigate = useNavigate();
  const bind = useLongPress(() => {
    onLongPress?.();
  }, {
    onCancel: () => {
      navigate(link);
    }
  });

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
  }

  return (
    <NavLink
      {...bind()} onClick={handleClick}
      className={className}
      to={link}
    >
      {children}
    </NavLink>
  )
}

export default NavLinkWithOptions;
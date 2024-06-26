import React from 'react';
import { usePathname } from 'next/navigation';
import { NavLink } from '@mantine/core';
import classes from './styles.module.scss';
import { ZhAutoNavLinksProps, ZhNavLinkProps } from "@/shared/components/ZhNavLink/types";

const ZhNavLink = ({ href, label, icon }: ZhNavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NavLink
      my={5}
      fw={530}
      className={classes.navlink}
      href={href}
      label={label}
      active={isActive}
      leftSection={icon}
    />
  );
};

const ZhAutoNavLinks = ({ links }: ZhAutoNavLinksProps) => {
  return links.map((link) => (
    <ZhNavLink
      key={link.href}
      href={link.href}
      label={link.label}
      icon={link.icon}
    />
  ))
};

export default ZhAutoNavLinks;
import React from "react";

export type ZhNavLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export type LinkItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export type ZhAutoNavLinksProps = {
  links: LinkItem[];
}
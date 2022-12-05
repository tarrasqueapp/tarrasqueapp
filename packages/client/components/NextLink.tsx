import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';
import Link, { LinkProps } from 'next/link';
import React, { Ref, forwardRef } from 'react';

type LinkRef = HTMLAnchorElement;
type NextLinkProps = Omit<MuiLinkProps, 'href' | 'classes'> & Pick<LinkProps, 'href' | 'as' | 'prefetch'>;

const CustomNextLink = ({ href, as, prefetch, ...props }: LinkProps, ref: Ref<LinkRef>) => (
  <Link href={href} as={as} prefetch={prefetch} passHref legacyBehavior>
    <MuiLink ref={ref} {...props} />
  </Link>
);

export const NextLink = forwardRef<LinkRef, NextLinkProps>(CustomNextLink);

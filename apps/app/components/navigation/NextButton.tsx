import { Button, ButtonProps } from '@mui/material';
import Link, { LinkProps } from 'next/link';
import { Ref, forwardRef } from 'react';

type LinkRef = HTMLAnchorElement;
type NextLinkProps = Omit<ButtonProps<'a'>, 'href' | 'classes'> & Pick<LinkProps, 'href' | 'as' | 'prefetch'>;

const CustomNextButton = ({ href, as, prefetch, ...props }: LinkProps, ref: Ref<LinkRef>) => (
  <Link href={href} as={as} prefetch={prefetch} passHref legacyBehavior>
    <Button component="a" ref={ref} {...props} />
  </Link>
);

export const NextButton = forwardRef<LinkRef, NextLinkProps>(CustomNextButton);

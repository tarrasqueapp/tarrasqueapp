import { Link, LinkProps } from '@mui/material';
import { Ref, forwardRef } from 'react';

type LinkRef = HTMLAnchorElement;

const CustomExternalLink = ({ ...props }: LinkProps, ref: Ref<LinkRef>) => (
  <Link ref={ref} target="_blank" rel="noopener noreferrer" {...props} />
);

export const ExternalLink = forwardRef<LinkRef, LinkProps>(CustomExternalLink);

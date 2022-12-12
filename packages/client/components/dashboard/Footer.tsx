import { Announcement, HelpCenter, NewReleases, Reddit, Storefront, Twitter, YouTube } from '@mui/icons-material';
import { Box, Button, Container, IconButton, Link, SvgIcon, Typography } from '@mui/material';
import React from 'react';

import { Color } from '../../lib/colors';
import { config } from '../../lib/config';
import DiscordIcon from '../../public/images/app-icons/discord.svg';
import PatreonIcon from '../../public/images/app-icons/patreon.svg';

/**
 * Footer component for showing useful and legal links
 */
export const Footer: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', flexShrink: 0, mt: 8, pb: 4, color: Color.GreyLight }}>
      <Container maxWidth="md">
        <Typography variant="caption" paragraph>
          {config.VERSION}
        </Typography>

        <Typography variant="caption">
          <Button href="/changelog" color="inherit" target="_blank" rel="noopener" startIcon={<Announcement />}>
            Changelog
          </Button>
          <Button href="/roadmap" color="inherit" target="_blank" rel="noopener" startIcon={<NewReleases />}>
            Roadmap
          </Button>
          <Button href="/help" color="inherit" target="_blank" rel="noopener" startIcon={<HelpCenter />}>
            Help Center
          </Button>
          <Button
            href="https://shop.tarrasque.app"
            color="inherit"
            target="_blank"
            rel="noopener"
            startIcon={<Storefront />}
          >
            Shop
          </Button>
        </Typography>

        <Box sx={{ pb: 1 }}>
          <IconButton component="a" href="/twitter" target="_blank" rel="noopener" color="inherit">
            <Twitter />
          </IconButton>
          <IconButton component="a" href="/youtube" target="_blank" rel="noopener" color="inherit">
            <YouTube />
          </IconButton>
          <IconButton component="a" href="/reddit" target="_blank" rel="noopener" color="inherit">
            <Reddit />
          </IconButton>
          <IconButton component="a" href="/discord" target="_blank" rel="noopener" color="inherit">
            <SvgIcon component={DiscordIcon} inheritViewBox />
          </IconButton>
          <IconButton component="a" href="/patreon" target="_blank" rel="noopener" color="inherit">
            <SvgIcon component={PatreonIcon} inheritViewBox />
          </IconButton>
        </Box>

        <Typography variant="caption">
          &copy; 2020-{new Date().getFullYear()} Tronite Ltd. All rights reserved.
          <br />
          <Link href="/terms-of-use" color="textSecondary">
            Terms of Use
          </Link>{' '}
          &middot;{' '}
          <Link href="/privacy-policy" color="textSecondary">
            Privacy Policy
          </Link>{' '}
          &middot;{' '}
          <Link href="/cookie-statement" color="textSecondary">
            Cookie Statement
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

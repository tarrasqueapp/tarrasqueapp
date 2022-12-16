import { Announcement, HelpCenter, NewReleases, Reddit, Storefront, Twitter, YouTube } from '@mui/icons-material';
import { Box, Button, Container, IconButton, SvgIcon, Typography } from '@mui/material';
import React from 'react';

import { Color } from '../../lib/colors';
import { config } from '../../lib/config';
import { LandingNavigation } from '../../lib/navigation';
import DiscordIcon from '../../public/images/app-icons/discord.svg';
import PatreonIcon from '../../public/images/app-icons/patreon.svg';
import { NextLink } from '../common/NextLink';

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
          <Button
            href="/changelog"
            color="inherit"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<Announcement />}
          >
            Changelog
          </Button>

          <Button href="/roadmap" color="inherit" target="_blank" rel="noopener noreferrer" startIcon={<NewReleases />}>
            Roadmap
          </Button>

          <Button href="/help" color="inherit" target="_blank" rel="noopener noreferrer" startIcon={<HelpCenter />}>
            Help Center
          </Button>

          <Button
            href="https://shop.tarrasque.app"
            color="inherit"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<Storefront />}
          >
            Shop
          </Button>
        </Typography>

        <Box sx={{ pb: 1 }}>
          <IconButton component="a" href="/twitter" target="_blank" rel="noopener noreferrer" color="inherit">
            <Twitter />
          </IconButton>

          <IconButton component="a" href="/youtube" target="_blank" rel="noopener noreferrer" color="inherit">
            <YouTube />
          </IconButton>

          <IconButton component="a" href="/reddit" target="_blank" rel="noopener noreferrer" color="inherit">
            <Reddit />
          </IconButton>

          <IconButton component="a" href="/discord" target="_blank" rel="noopener noreferrer" color="inherit">
            <SvgIcon component={DiscordIcon} inheritViewBox />
          </IconButton>

          <IconButton component="a" href="/patreon" target="_blank" rel="noopener noreferrer" color="inherit">
            <SvgIcon component={PatreonIcon} inheritViewBox />
          </IconButton>
        </Box>

        <Typography variant="caption">
          &copy; 2020-{new Date().getFullYear()} Tronite Ltd. All rights reserved.
          <br />
          <NextLink
            href={`${config.LANDING_URL}${LandingNavigation.TermsOfUse}`}
            color="textSecondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Use
          </NextLink>{' '}
          &middot;{' '}
          <NextLink
            href={`${config.LANDING_URL}${LandingNavigation.PrivacyPolicy}`}
            color="textSecondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </NextLink>{' '}
          &middot;{' '}
          <NextLink
            href={`${config.LANDING_URL}${LandingNavigation.CookieStatement}`}
            color="textSecondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cookie Statement
          </NextLink>
        </Typography>
      </Container>
    </Box>
  );
};

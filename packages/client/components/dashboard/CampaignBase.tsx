import { Edit, ExpandMore, MoreHoriz } from '@mui/icons-material';
import {
  AccordionProps,
  AccordionSummaryProps,
  Box,
  IconButton,
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Skeleton,
  Tooltip,
  Typography,
  styled,
} from '@mui/material';

import { CampaignInterface, MapInterface } from '../../lib/types';
import { MathUtils } from '../../utils/MathUtils';
import { Map } from './Map';
import { MapNew } from './MapNew';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
  ({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:before': {
      display: 'none',
    },
    boxShadow: 'none',
    background: 'rgba(0, 0, 0, 0.5)',
  }),
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ExpandMore />} {...props} />
))({
  borderRadius: '20px 20px',
  '&.Mui-expanded': {
    borderRadius: '20px 20px 0 0',
  },
  backgroundColor: 'rgba(0, 0, 0, .03)',
});

const AccordionDetails = styled(MuiAccordionDetails)({
  padding: 0,
  borderTop: '1px solid rgba(0, 0, 0, .125)',
});

interface ICampaignBaseProps {
  campaign?: CampaignInterface;
  maps?: MapInterface[];
}

export const CampaignBase: React.FC<ICampaignBaseProps> = ({ campaign, maps }) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: '1 0 auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h3">
              {campaign ? campaign.name : <Skeleton width={MathUtils.getRandomBetween(100, 300)} />}
            </Typography>
            <Typography variant="caption">
              {maps ? maps.length : <Skeleton width={10} sx={{ display: 'inline-block' }} />} map
              {!maps || maps.length > 1 ? 's' : ''}
            </Typography>
          </Box>

          <Box>
            <Tooltip title="Edit">
              <IconButton onClick={(event) => event.stopPropagation()}>
                <Edit />
              </IconButton>
            </Tooltip>

            <Tooltip title="More">
              <IconButton onClick={(event) => event.stopPropagation()}>
                <MoreHoriz />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', p: 3, gap: 3 }}>
          <MapNew />

          {maps ? (
            maps?.map((map) => <Map key={map.id} map={map} />)
          ) : (
            <>
              {[...Array(5)].map(() => (
                <Map key={Math.random()} />
              ))}
            </>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

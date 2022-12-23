import { Delete, Edit, ExpandMore, MoreHoriz } from '@mui/icons-material';
import {
  AccordionActions,
  AccordionProps,
  AccordionSummaryProps,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Popover,
  Skeleton,
  Tooltip,
  Typography,
  styled,
} from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';

import { useGetCampaignMaps } from '../../hooks/data/maps/useGetCampaignMaps';
import { CampaignInterface } from '../../lib/types';
import { store } from '../../store';
import { CampaignModal } from '../../store/campaigns';
import { MathUtils } from '../../utils/MathUtils';
import { MapCard } from './MapCard';
import { NewMap } from './NewMap';

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
  borderRadius: '10px 10px',
  '&.Mui-expanded': {
    borderRadius: '10px 10px 0 0',
  },
  backgroundColor: 'rgba(0, 0, 0, 0.03)',
});

const AccordionDetails = styled(MuiAccordionDetails)({
  padding: 0,
  borderTop: '1px solid rgba(0, 0, 0, 0.125)',
});

export interface CampaignAccordionProps {
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  campaign?: CampaignInterface;
}

export const CampaignAccordion: React.FC<CampaignAccordionProps> = ({ expanded, onToggle, campaign }) => {
  const { data: maps } = useGetCampaignMaps(campaign?.id);

  return (
    <Accordion expanded={campaign ? expanded : true} onChange={(event, expanded) => onToggle?.(expanded)}>
      <AccordionSummary>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          <Typography variant="h3">
            {campaign ? campaign.name : <Skeleton width={MathUtils.getRandomBetween(100, 300)} />}
          </Typography>

          <Typography variant="caption">
            {maps ? maps.length : <Skeleton width={10} sx={{ display: 'inline-block' }} />} map
            {!maps || maps.length === 1 ? '' : 's'}
          </Typography>
        </Box>

        <AccordionActions>
          <Box sx={{ display: 'flex' }} onClick={(event) => event.stopPropagation()}>
            <Tooltip title="Update">
              <IconButton
                onClick={() => {
                  if (!campaign) return;
                  store.campaigns.setSelectedCampaign(campaign);
                  store.campaigns.setModal(CampaignModal.CreateUpdate);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>

            <PopupState variant="popover" popupId={`campaign-accordion-${campaign?.id}`}>
              {(popupState) => (
                <>
                  <Tooltip title="More">
                    <IconButton {...bindTrigger(popupState)}>
                      <MoreHoriz />
                    </IconButton>
                  </Tooltip>

                  <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                    <MenuList>
                      <MenuItem
                        onClick={() => {
                          if (!campaign) return;
                          store.campaigns.setSelectedCampaign(campaign);
                          store.campaigns.setModal(CampaignModal.Delete);
                          popupState.close();
                        }}
                      >
                        <ListItemIcon>
                          <Delete />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                      </MenuItem>
                    </MenuList>
                  </Popover>
                </>
              )}
            </PopupState>
          </Box>
        </AccordionActions>
      </AccordionSummary>

      <AccordionDetails>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'inherit' },
            p: 3,
            gap: 3,
          }}
        >
          {maps ? (
            maps?.map((map) => <MapCard key={map.id} map={map} campaign={campaign} />)
          ) : (
            <>
              {[...Array(8)].map((item, index) => (
                <MapCard key={index} />
              ))}
            </>
          )}

          <NewMap campaign={campaign || null} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

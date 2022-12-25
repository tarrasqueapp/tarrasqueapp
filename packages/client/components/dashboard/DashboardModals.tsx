import { observer } from 'mobx-react-lite';

import { useGetUser } from '../../hooks/data/users/useGetUser';
import { store } from '../../store';
import { CampaignModals } from '../campaigns/CampaignModals';
import { MapModals } from '../maps/MapModals';
import { SettingsModal } from './SettingsModal';

export const DashboardModals: React.FC = observer(() => {
  const { data: user } = useGetUser();

  return (
    <>
      <CampaignModals />

      <MapModals />

      <SettingsModal
        open={store.dashboard.settingsModalOpen}
        onClose={() => store.dashboard.toggleSettingsModal(false)}
        user={user}
      />
    </>
  );
});

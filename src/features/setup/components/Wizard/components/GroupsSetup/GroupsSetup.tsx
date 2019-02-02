import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from 'RootStore';
import { AppShellStore } from 'features/app-shell';
import { GroupsList } from './components/GroupsList';

interface Props {
  store: AppShellStore;
}

@observer
class GroupsSetupObserver extends React.Component<Props> {
  render() {
    const { store } = this.props;

    return (
      <div>
        <p>Choose your groups</p>
        <GroupsList store={store.settings.groups} />
      </div>
    );
  }
}

export const GroupsSetup = () => (
  <StoreContext.Consumer>
    {({ appShell }) => <GroupsSetupObserver store={appShell} />}
  </StoreContext.Consumer>
);

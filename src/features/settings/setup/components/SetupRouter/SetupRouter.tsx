import React from 'react';
import { observer } from 'mobx-react';
import { RouteComponentProps, redirectTo } from '@reach/router';
import { StoreContext } from 'RootStore';
import { SettingsStore } from 'features/settings';

interface Props {
  settings: SettingsStore;
}

@observer
class SetupObserver extends React.Component<Props> {
  render() {
    const { settings } = this.props;
    if (settings.isSetupComplete) {
      redirectTo('/');
    }

    return this.props.children;
  }
}

export const SetupRouter: React.FunctionComponent<RouteComponentProps> = ({
  children
}) => (
  <StoreContext.Consumer>
    {({ entity }) => (
      <SetupObserver settings={entity.settings} children={children} />
    )}
  </StoreContext.Consumer>
);

import React from 'react';
import { RouteComponentProps, redirectTo } from '@reach/router';
import { StoreContext } from 'RootStore';

export const SetupRouter: React.FunctionComponent<RouteComponentProps> = ({
  children
}) => {
  const store = React.useContext(StoreContext);
  if (store.entity.settings.isSetupComplete) {
    redirectTo('/');
  }

  return <React.Fragment>{children}</React.Fragment>;
};

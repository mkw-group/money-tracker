import React from 'react';
import { observer } from 'mobx-react';
import { Router, navigate } from '@reach/router';
import { StoreContext } from 'RootStore';
import { SettingsStore, SetupRouter, Wizard } from 'features/settings';
import { SessionStore, SessionPrompt, SignIn } from 'features/session';
import { Dashboard } from 'features/dashboard';
import './AppShell.scss';

interface Props {
  settings: SettingsStore;
  session: SessionStore;
}

const AppShellObserver = observer(({ session, settings }: Props) => {
  // if (session.isUnknown && !settings.isSetupComplete) {
  //   navigate('/setup');
  // } else if (!settings.isSetupComplete) {
  //   navigate('/setup/wizard');
  // }

  return (
    <Router>
      <SetupRouter path="/setup">
        <SessionPrompt path="/" />
        <SignIn path="signin" />
        <Wizard path="wizard" />
      </SetupRouter>
      <Dashboard path="/" />
    </Router>
  );
});

export const AppShell = () => (
  <StoreContext.Consumer>
    {({ entity }) => (
      <AppShellObserver session={entity.session} settings={entity.settings} />
    )}
  </StoreContext.Consumer>
);

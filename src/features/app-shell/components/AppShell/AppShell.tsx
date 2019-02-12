import React from 'react';
import { observer } from 'mobx-react-lite';
import { Router, navigate } from '@reach/router';
import { StoreContext } from 'RootStore';
import { SetupRouter, Wizard } from 'features/settings/components';
import { SessionPrompt, SignIn } from 'features/session/components';
import { Dashboard } from 'features/dashboard';
import { Footer } from './Footer';
import './AppShell.scss';

const Comp = () => {
  const store = React.useContext(StoreContext);
  const { session, settings } = store.entity;

  // if (session.isUnknown && !settings.isSetupComplete) {
  //   navigate('/setup');
  // } else if (!settings.isSetupComplete) {
  //   navigate('/setup/wizard');
  // }

  return (
    <div className="AppShell">
      <Router>
        <SetupRouter path="/setup">
          <SessionPrompt path="/" />
          <SignIn path="signin" />
          <Wizard path="wizard" />
        </SetupRouter>
        <Dashboard path="/" />
      </Router>
      <Footer />
    </div>
  );
};

export const AppShell = observer(Comp);

import React from 'react';
import { observer } from 'mobx-react';
import { RouteComponentProps } from '@reach/router';
import { Header, Segment, Step } from 'semantic-ui-react';

import './Wizard.scss';
import { AssetsSetup } from './components/AssetsSetup';

export const Wizard: React.FunctionComponent<RouteComponentProps> = () => {
  return (
    <Segment.Group className="Wizard u-container">
      <Segment attached>
        <Header icon="cogs" content="MoneyTracker Setup" />
      </Segment>
      <Step.Group fluid attached>
        <Step title="Assets" icon="money bill alternate outline" active />
        <Step title="Categories" icon="tasks" />
        <Step title="Groups" icon="folder open outline" />
        <Step title="Accounts" icon="credit card outline" />
      </Step.Group>
      <Segment attached>
        <AssetsSetup />
      </Segment>
    </Segment.Group>
  );
};

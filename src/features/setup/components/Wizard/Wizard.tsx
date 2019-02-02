import React from 'react';
import { observer } from 'mobx-react';
import { RouteComponentProps } from '@reach/router';
import { Header, Segment, Step } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';
import { WizardStep, WizardUiStore } from 'features/setup';
import { AssetsSetup } from './components/AssetsSetup';
import { GroupsSetup } from './components/GroupsSetup';
import './Wizard.scss';
import 'styles/dnd.scss';

const StepComponent: Record<WizardStep, React.ReactNode> = {
  groups: <GroupsSetup />,
  accounts: <div>accounts</div>,
  categories: <div>categories</div>,
  currency: <AssetsSetup />
};

interface Props {
  store: WizardUiStore;
}

@observer
class WizardObserver extends React.Component<Props> {
  render() {
    const { activeStep } = this.props.store;

    return (
      <Segment.Group className="Wizard u-container">
        <Segment attached>
          <Header icon="cogs" content="MoneyTracker Setup" />
        </Segment>
        <Step.Group size="tiny" fluid attached>
          <Step
            title="Groups"
            icon="folder open outline"
            active={activeStep === 'groups'}
          />
          <Step
            title="Accounts"
            icon="credit card outline"
            active={activeStep === 'accounts'}
          />
          <Step
            title="Categories"
            icon="tasks"
            active={activeStep === 'categories'}
          />
          <Step
            title="Currency"
            icon="yen sign"
            active={activeStep === 'currency'}
            onClick={() => this.props.store.changeActiveStep('currency')}
          />
        </Step.Group>
        <Segment attached>{StepComponent[activeStep]}</Segment>
      </Segment.Group>
    );
  }
}

export const Wizard: React.FunctionComponent<RouteComponentProps> = () => (
  <StoreContext.Consumer>
    {({ ui }) => <WizardObserver store={ui.wizard} />}
  </StoreContext.Consumer>
);

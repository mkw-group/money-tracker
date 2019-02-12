import React from 'react';
import { t } from 'ttag';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from '@reach/router';
import { Header, Segment, Step, Icon } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';
import { WizardStep } from 'features/settings';
import { AccountSetup } from './AccountSetup';
import { AssetsSetup } from './AssetsSetup';
import 'styles/dnd.scss';
import './Wizard.scss';

const StepView: Record<WizardStep, React.ReactNode> = {
  accounts: <AccountSetup />,
  categories: <div>categories</div>,
  currency: <AssetsSetup />
};

interface StepItemProps {
  id: WizardStep;
  icon: string;
  title: string;
}

const StepItem: React.FunctionComponent<StepItemProps> = ({
  id,
  icon,
  title
}) => {
  const ui = React.useContext(StoreContext).ui.wizard;

  return (
    <Step
      icon={icon}
      title={title}
      active={ui.activeStep === id}
      completed={ui.completedSteps[id]}
      onClick={
        ui.completedSteps[id] && ui.activeStep !== id
          ? () => ui.changeActiveStep(id)
          : undefined
      }
    />
  );
};

export const Wizard: React.FunctionComponent<RouteComponentProps> = observer(
  () => {
    const ui = React.useContext(StoreContext).ui.wizard;

    return (
      <Segment.Group className="Wizard">
        <Segment attached>
          <Header as="h2">
            <Icon name="settings" />
            <Header.Content>
              MoneyTracker
              <Header.Subheader>{t`First-time user setup`}</Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>
        <Step.Group fluid attached>
          <StepItem
            id="accounts"
            title={t`Accounts`}
            icon="credit card outline"
          />
          <StepItem id="categories" title={t`Categories`} icon="tasks" />
          <StepItem id="currency" title={t`Currency`} icon="yen sign" />
        </Step.Group>
        <Segment attached>{StepView[ui.activeStep]}</Segment>
      </Segment.Group>
    );
  }
);

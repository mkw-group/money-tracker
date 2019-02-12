import { observable, action } from 'mobx';

export type WizardStep = 'accounts' | 'categories' | 'currency';

export class WizardUiStore {
  @observable activeStep: WizardStep = 'accounts';
  @observable completedSteps: Record<WizardStep, boolean> = {
    accounts: false,
    categories: false,
    currency: false
  };

  @action completeStep(step: WizardStep, next: WizardStep) {
    this.completedSteps[step] = true;
    this.changeActiveStep(next);
  }

  @action changeActiveStep(next: WizardStep) {
    this.activeStep = next;
  }
}

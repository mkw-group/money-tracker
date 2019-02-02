import { observable, action } from 'mobx';

export type WizardStep = 'groups' | 'accounts' | 'categories' | 'currency';

export class WizardUiStore {
  @observable activeStep: WizardStep = 'groups';

  @action changeActiveStep(next: WizardStep) {
    this.activeStep = next;
  }
}

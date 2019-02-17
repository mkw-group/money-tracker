import React from 'react';
import { t } from 'ttag';
import { observer } from 'mobx-react-lite';
import { Modal, Form, Input, Header } from 'semantic-ui-react';
import { StoreContext } from 'RootStore';
import { AssetFinderDropdown } from './AssetFinderDropdown';
import { AssetList } from './AssetsList';
import './AccountForm.scss';

export const AccountForm = observer(() => {
  const store = React.useContext(StoreContext);
  const { accounts, money } = store.entity;
  const { form } = accounts;
  // @ts-ignore
  const nameInputRef = React.useRef();
  React.useEffect(() => {
    if (nameInputRef && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  });

  if (!form) return null;

  return (
    <Modal
      className="moneytracker AccountForm"
      size="small"
      open={true}
      closeIcon={true}
      closeOnEscape={false}
      closeOnDimmerClick={false}
      onClose={accounts.closeForm}
    >
      <Header
        icon="file alternate outline"
        content={form.isNew ? t`New account` : t`Edit account`}
      />
      <Modal.Content>
        <Form onSubmit={accounts.submitForm}>
          <Form.Field required>
            <label htmlFor="account-form-input-name">{t`Name`}</label>
            <Input
              id="account-form-input-name"
              placeholder={t`Account name`}
              ref={nameInputRef}
              value={form.name}
              onChange={(_, { value }) => {
                form.name = value;
              }}
              required
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor="account-form-input-assets">{t`Assets`}</label>
            <AssetFinderDropdown
              id="account-form-input-assets"
              selected={new Set(form.assets)}
              onSelect={(asset) => {
                money.addAsset(asset);
                form.model.addAsset(asset.id);
              }}
            />
          </Form.Field>
          <AssetList account={form.model} />
          <Form.Group className="AccountForm-buttonContainer">
            <Form.Button
              type="button"
              aria-label={t`Close account form`}
              content={t`Cancel`}
              onClick={accounts.closeForm}
              basic
            />
            <Form.Button
              type="submit"
              aria-label={t`Save account`}
              content={t`Save`}
              disabled={form.assets.length === 0}
              primary
            />
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
});

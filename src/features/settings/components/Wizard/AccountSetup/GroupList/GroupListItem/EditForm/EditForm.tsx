import React from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Input } from 'semantic-ui-react';
import { GroupsStore } from 'features/settings';

interface GroupEditFormPros {
  store: GroupsStore;
}

export const EditForm: React.FunctionComponent<GroupEditFormPros> = observer(
  ({ store }) => {
    // @ts-ignore
    const inputRef = React.useRef();
    const keydownListener = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') {
        store.closeForm();
      }
    };

    React.useEffect(() => {
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
        window.addEventListener('keydown', keydownListener);

        return () => window.removeEventListener('keydown', keydownListener);
      }
    });

    const form = store.form;
    if (!form) return null;

    return (
      <Form onSubmit={() => store.submitForm()}>
        <Input
          size="big"
          value={form.name}
          onChange={(_, { value }) => {
            form.name = value;
          }}
          ref={inputRef}
          transparent
          required
          fluid
        />
      </Form>
    );
  }
);

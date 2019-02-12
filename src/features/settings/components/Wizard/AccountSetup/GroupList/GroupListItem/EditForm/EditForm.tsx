import React from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Input } from 'semantic-ui-react';
import { GroupsStore, IAccountGroup } from 'features/settings';

interface GroupEditFormPros {
  store: GroupsStore;
  group: IAccountGroup;
}

export const EditForm: React.FunctionComponent<GroupEditFormPros> = observer(
  ({ store, group }) => {
    // @ts-ignore
    const inputRef = React.useRef();
    const keydownListener = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') {
        store.form.closeForm();
      }
    };

    React.useEffect(() => {
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
        window.addEventListener('keydown', keydownListener);

        return () => window.removeEventListener('keydown', keydownListener);
      }
    });

    return (
      <Form onSubmit={() => store.save(group)}>
        <Input
          size="big"
          value={store.form.name}
          onChange={store.form.updateGroupName}
          ref={inputRef}
          transparent
          fluid
        />
      </Form>
    );
  }
);

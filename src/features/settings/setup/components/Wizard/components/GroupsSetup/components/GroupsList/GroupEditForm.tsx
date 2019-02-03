import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Input } from 'semantic-ui-react';
import { GroupsStore, IAccountGroup } from 'features/settings';

interface GroupEditFormPros {
  store: GroupsStore;
  group: IAccountGroup;
}

@observer
export class GroupEditForm extends Component<GroupEditFormPros> {
  private inputRef = React.createRef<Input>();

  componentDidMount() {
    if (this.inputRef && this.inputRef.current) {
      this.inputRef.current.focus();

      window.addEventListener('keydown', this.keydownListener);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keydownListener);
  }

  keydownListener = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      this.props.store.ui.closeEditForm();
    }
  };

  render() {
    const { store, group } = this.props;

    return (
      <Form onSubmit={() => store.saveGroup(group)}>
        <Input
          size="big"
          value={store.ui.editGroupName}
          onChange={store.ui.updateGroupName}
          ref={this.inputRef}
          transparent
          fluid
        />
      </Form>
    );
  }
}

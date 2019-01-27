import React from 'react';
import { observer } from 'mobx-react';
import { Header, Checkbox, Table, Button } from 'semantic-ui-react';
import { MoneySettingsStore } from 'features/settings';

interface Props {
  store: MoneySettingsStore;
}

@observer
export class AssetsList extends React.Component<Props> {
  render() {
    const { store } = this.props;

    return (
      <Table>
        <Table.Header fullWidth>
          <Table.Row>
            <Table.HeaderCell>Asset</Table.HeaderCell>
            <Table.HeaderCell>Base</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {store.assets.map((asset) => (
            <Table.Row key={asset.id}>
              <Table.Cell width={15}>
                <Header>
                  {asset.code}, {asset.name}
                </Header>
                {asset.description}
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Checkbox
                  onChange={store.updateBaseCurrency}
                  checked={asset.id === store.baseCurrency}
                  value={asset.id}
                  toggle
                />
              </Table.Cell>
              <Table.Cell>
                <Button
                  icon="remove"
                  size="tiny"
                  disabled={asset.id === store.baseCurrency}
                  onClick={() => store.removeAsset(asset)}
                  circular
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

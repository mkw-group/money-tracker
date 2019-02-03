import React, { SyntheticEvent } from 'react';
import { debounce } from 'lodash';
import { Dropdown, DropdownProps, DropdownItemProps } from 'semantic-ui-react';
import { IAsset, AssetId } from 'features/settings';
import { findAssets } from 'webtasks/AssetSearch.client';
import './AssetFinderDropdown.scss';

interface Props {
  selected: Set<AssetId>;
  onSelect: (asset: IAsset) => void;
}

interface State {
  isFetching: boolean;
  options: DropdownItemProps[];
  assets: Record<AssetId, IAsset>;
}

export class AssetFinderDropdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isFetching: false,
      options: [],
      assets: {}
    };
  }

  componentDidMount() {
    this.fetchOptions();
  }

  handleQueryChange = (_: SyntheticEvent, { searchQuery }: DropdownProps) => {
    this.fetchOptions(String(searchQuery));
  };

  handleSelect = (event: SyntheticEvent, { value }: DropdownProps) => {
    if (event.target === event.currentTarget) {
      this.props.onSelect(this.state.assets[String(value)]);
    }
  };

  fetchOptions = debounce(async (query: string = '') => {
    this.setState({ isFetching: true });

    const items = await findAssets(query);

    this.setState({
      isFetching: false,
      options: items.map(({ id, code, name, description }) => ({
        key: id,
        text: `${code} ${name}`,
        content: (
          <React.Fragment>
            <span className="asset-code">{code}</span> {name}
          </React.Fragment>
        ),
        description,
        value: id
      })),
      assets: items.reduce<Record<AssetId, IAsset>>((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      }, {})
    });
  }, 300);

  render() {
    return (
      <Dropdown
        className="AssetFinderDropdown"
        placeholder="EUR, Bitcoin or MSFT"
        selectOnNavigation={false}
        options={this.state.options.filter(
          ({ value }) => !this.props.selected.has(String(value))
        )}
        loading={this.state.isFetching}
        onSearchChange={this.handleQueryChange}
        onChange={this.handleSelect}
        value=""
        fluid
        search
        selection
      />
    );
  }
}

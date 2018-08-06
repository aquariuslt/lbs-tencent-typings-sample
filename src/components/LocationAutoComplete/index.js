import './style.css';

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';

import lbsApi from '../../api/lbs-api';

const SEARCH_PLACEHOLDER = 'Search Location ...';

const Option = AutoComplete.Option;

class LocationAutoComplete extends React.Component {
  static propTypes = {
    minLength: PropTypes.number,
    onChange: PropTypes.func
  };

  static defaultProps = {
    minLength: 2
  };

  state = {
    selectedItem: {},
    dataSource: []
  };

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    lbsApi.loadScript().then(() => {
    });
  }

  onSearch = _.debounce((value) => {
    let $this = this;
    if (value.length >= $this.props.minLength) {
      console.log('searching:', value);
      lbsApi.searchLocation(value).then((result) => {
        console.log('searching result:', result);
        if (_.get(result, 'detail.pois')) {
          $this.setState({
            dataSource: _.get(result, 'detail.pois')
          });
        }
      });
    }
    else {
      $this.setState({
        dataSource: []
      });
    }
  }, 1000);

  onSelect = (id) => {
    let $this = this;
    let selectedItem = _.find($this.state.dataSource, {id: id});
    console.log('selecting:', selectedItem);
    $this.setState({
      selectedItem: selectedItem
    }, () => {
      if ($this.props.onChange) {
        $this.props.onChange(selectedItem);
      }
    });
  };

  render() {
    let $this = this;
    const options = $this.state.dataSource.map((item) => (
      <Option
        className="lbs-autocomplete-option"
        key={item.id}
        label={item.name}
      >
        <div>{item.name}</div>
        <div className="lbs-autocomplete-address">{item.address}</div>
      </Option>
    ));
    return (
      <div className="lbs-autocomplete-container">
        <AutoComplete
          placeholder={SEARCH_PLACEHOLDER}
          onSearch={$this.onSearch}
          onSelect={$this.onSelect}
          optionLabelProp="label"
        >
          {options}
        </AutoComplete>
      </div>
    );
  }
}

export default LocationAutoComplete;

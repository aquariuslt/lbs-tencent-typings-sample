import './style.css';

import React from 'react';
import PropTypes from 'prop-types';

import lbsApi from '../../api/lbs-api';

const DEFAULT_LATLNG = {
  lat: 39.916527,
  lng: 116.397128
};

const DEFAULT_ZOOM_LEVEL = 15;

class LocationUISelector extends React.Component {
  static propTypes = {
    latLng: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number
    }),
    zoom: PropTypes.number
  };

  static defaultProps = {
    latLng: DEFAULT_LATLNG,
    zoom: DEFAULT_ZOOM_LEVEL
  };

  constructor(props) {
    super(props);
    let $this = this;
    $this.mapRef = React.createRef();
  }

  mapRef;
  mapInstance;
  markerInstance;

  componentDidMount() {
    let $this = this;
    lbsApi.loadScript().then(() => {
      $this.createMap();
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let $this = this;
    const qq = window.qq;
    $this.mapInstance.setCenter(new qq.maps.LatLng(nextProps.latLng.lat, nextProps.latLng.lng));
    $this.markerInstance.setPosition(new qq.maps.LatLng(nextProps.latLng.lat, nextProps.latLng.lng));
    $this.forceUpdate();
  }

  createMap() {
    let $this = this;
    const qq = window.qq;
    $this.mapInstance = new qq.maps.Map($this.mapRef.current, {
      center: new qq.maps.LatLng($this.props.latLng.lat, $this.props.latLng.lng),
      zoom: $this.props.zoom
    });
    $this.markerInstance = new qq.maps.Marker({
      position: new qq.maps.LatLng($this.props.latLng.lat, $this.props.latLng.lng),
      map: $this.mapInstance
    });
  }

  render() {
    let $this = this;
    return (
      <div
        className="location-ui-selector-container"
        ref={$this.mapRef}
      >
      </div>
    );
  }
}

export default LocationUISelector;

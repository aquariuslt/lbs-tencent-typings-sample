import qs from 'qs';
import _ from 'lodash';

/**
 * LBS API Configurations
 **/
const API_VERSION = '2.exp';
const API_KEY = 'CGJBZ-S4BCJ-65IF4-FU5HM-YM4WQ-KPB2E';  // Please replace your key here
const API_SCRIPT_LOADED_CALLBACK = '__LBS_TENCENT_API_LOADED_CALLBACK';
const API_SCRIPT_LOADED_FLAG = '__LBS_TENCENT_API_SCRIPT_LOAD_STATUS__';
const API_SCRIPT_BASE_URL = '//map.qq.com/api/js?';

const API_SCRIPT_URL = `${API_SCRIPT_BASE_URL}${qs.stringify({
  v: API_VERSION,
  key: API_KEY,
  callback: API_SCRIPT_LOADED_CALLBACK
})}`;

const API_SCRIPT_LOAD_STATUS = {
  NOT_LOADED: 0,
  LOADING: 1,
  LOADED: 2
};

/**
 * Search Service Constants
 **/
const DEFAULT_LOCATION = '深圳市';

function loadMapApiScript() {
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = API_SCRIPT_URL;
  document.body.appendChild(script);
}

function initScriptStatus() {
  window[API_SCRIPT_LOADED_FLAG] = API_SCRIPT_LOAD_STATUS.NOT_LOADED;
}

/**
 * @desc async load map api script only once
 * @return {Promise}
 * */
function loadScript() {
  return new Promise((resolve) => {
    if (window[API_SCRIPT_LOADED_FLAG] === API_SCRIPT_LOAD_STATUS.NOT_LOADED) {
      console.log('load script start');
      window[API_SCRIPT_LOADED_FLAG] = API_SCRIPT_LOAD_STATUS.LOADING;
      window[API_SCRIPT_LOADED_CALLBACK] = () => {
        console.log('load script complete (should only appear once)');
        window[API_SCRIPT_LOADED_FLAG] = API_SCRIPT_LOAD_STATUS.LOADED;
        resolve();
      };
      loadMapApiScript();
    } else if (window[API_SCRIPT_LOADED_FLAG] === API_SCRIPT_LOAD_STATUS.LOADING) {
      console.log('waiting for script complete');
      let waitingId = null;
      waitingId = setInterval(() => {
        if (window[API_SCRIPT_LOADED_FLAG] === API_SCRIPT_LOAD_STATUS.LOADED && waitingId !== null) {
          clearInterval(waitingId);
          resolve();
        }
      }, 500);
    } else {
      resolve();
    }
  });
}

/**
 * @param {String} keyword
 * @return {Promise<{
 *   type: ServiceResultType,
 *   detail: <PoiList>
 * }>}
 * */
function searchLocation(keyword) {
  return new Promise((resolve, reject) => {
    function oneTimeResolve(oneTimeResult) {
      console.log('first time resolve result:', oneTimeResult);
      if (_.get(oneTimeResult, 'detail.pois')) {
        resolve(oneTimeResult);
      } else {
        console.log('can not match result, will pass one current result for hinting', oneTimeResult);
        scaleSearchAreaResolve(oneTimeResult);
      }
    }

    function scaleSearchAreaResolve(hints) {
      let extendLocation = DEFAULT_LOCATION;

      if (_.isEqual(_.get(hints, 'type'), 'CITY_LIST')) {
        extendLocation = _.head(_.get(hints, 'detail.cities'))['cityName'];
      }

      let scaleSearchAreaService = new qq.maps.SearchService({
        location: extendLocation,
        autoExtend: true,
        complete: resolve,
        error: reject
      });
      scaleSearchAreaService.search(keyword);
    }

    const qq = window.qq;
    let searchService = new qq.maps.SearchService({
      autoExtend: true,
      complete: oneTimeResolve,
      error: reject
    });
    searchService.search(keyword);
  });
}

initScriptStatus();
export default {
  loadScript,
  searchLocation
};

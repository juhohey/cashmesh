
import heat from './heat';
import store from '../../core/store';
import style from './style.scss';
import http from '../../core/http';
import scale from '../../core/scale';
/**
* Module
*/
const heatmap = function() {
  'use strict';

  const API_ADDR = "http://40.113.85.15/cashmesh?get_heatmap";
  let _lastData;
  let heatmap = Vue.extend( {
    template:`<div class="heatmap-container">
      <div class="app-header">
        <div class="container">
          <div class="app-heading">
            <h1 class="app-heading-heading">Heatmap</h1>
            <p class="app-description">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>
      <div class="heatmap" id="heatmap">
    </div>`,
    data(){
      return {};
    },
    mounted(){
      heat.init('#heatmap');
      http.get(API_ADDR)
      .then((data) => {
        _lastData = data;
        setData(data.splice(0));
      })
      .catch((err) => {
        console.error(err);
      });

      // store.listen('resize', ()=>{
      //   heat.destroy();
      //   heat.init('#heatmap');
      //   setData(_lastData);
      // });
    }
  });

  function setData(data) {
    if(scale.should()){
      data = scale.getHeatValues(data);
      data = scale.scaleValues(data);
      console.log(data);
    }
    heat.setData(data);
  }

  return heatmap;
};

export default heatmap();

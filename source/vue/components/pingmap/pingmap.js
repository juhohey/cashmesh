
import ping from './ping';
import store from '../../core/store';
import http from '../../core/http';
import toast from '../toast/toast';
import style from './style.scss';
import scale from '../../core/scale';
/**
* Module
*/
const pingmap = function() {
  'use strict';

  const POINT_MAP = 'http://40.113.85.15/cashmesh?get_positions';
  const USER_PING = 'http://40.113.85.15/cashmesh?get_active_tickets';
  const UNPIN_USER = 'http://40.113.85.15/cashmesh?unpin_user=';
  let _intervals = {};
  let _isToast = false;
  let pingmap = Vue.extend({
    template:`<div class="view">
    <div class="app-header">
      <div class="container">
        <div class="app-heading">
          <h1 class="app-heading-heading">Customer map</h1>
          <p class="app-description">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
    </div>
      <div id="ping"></div>
    </div>`,
    data(){
      return {};
    },
    created(){

    },
    mounted(){
      ping.make("#ping");

      startPing();
      startPin();

      store.listen('unpin_user', (id)=>{
        http.get(`${UNPIN_USER}${id}`)
        .then((succes) => {
          console.info(succes);
        });
      });
    },
    destroyed(){
      for(let k in _intervals){
        window.clearInterval(_intervals[k]);
      }
      let elements = document.querySelectorAll('.d3-tip');
      for (var i = 0; i < elements.length; i++) {
          elements[i].parentElement.removeChild(  elements[i]);
      }

    }
  });

  function startPing() {
    _intervals.point = setInterval(()=>{
      http.get(POINT_MAP)
      .then((_data) => { //console.log(_data);
        _data = [_data];
          if(scale.should()){
            _data = scale.getCoordinates(_data);
            console.log(_data);
          }
          ping.addData(_data);
      })
      .catch((err) => {console.error(err);});
    }, 1500);
  }

  function startPin() {
    _intervals.pin = setInterval(()=>{
      http.get(USER_PING)
      .then((_data) => {
          let pinnedUsers = getPinnedUsers(_data);
          if(pinnedUsers.length){
            ping.setPinned(pinnedUsers);
            ping.showTip();
          }

      })
      .catch((err) => {console.error(err);});
    }, 1500);
  }

  function makeToast() {
    if(_isToast) return;
    _isToast = true;
  //  ping.showTip();
    toast.make("user needs help", 'view', ()=>{
      console.log('Dismiss');

      toast.dismiss();
      _isToast = false;
    });
  }

  function getPinnedUsers(data) {
    return data
      .map( (item, index)=>{
        if(item) return index;
      })
      .filter((item, index) => {
        if(index === 0 && item === 0 || item) { return index || '0';}})
      .map( (item)=>{

        return item.toString();
      });
  }

  return pingmap;
};

export default pingmap();

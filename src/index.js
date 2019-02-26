require('./utils/css/index.css')
require('./utils/css/icon-style.css')
//由于require是异步的，这么引入页面会导致要使用onload或promise，看着不舒服
// require('./index.html')

import axios from "axios"
require('../mock&axios/mock.js')
// axios是异步的（ajax是可选异步/同步）
// 因此需要通过promise来将其转换成同步
// 若放在其他组件中不方便后续编写（每次都需要onload）
import { calIndex } from './utils/js/btnEvents.js'
import { songRender as sR } from './utils/js/songInfoRender.js'
import { musicControl as mC } from './utils/js/musicControl.js'
import { progressBar as pB } from './utils/js/progressControl.js'
import { ezSizzle, switchTime } from './utils/js/utils.js'
// import { lrcControl as lC } from './utils/js/lrcHandler.js'

window._utils = {};
window._utils.ezSizzle = ezSizzle;
window._utils.switchTime = switchTime;
// 由于多个组件都需要该工具，因此直接挂载到window上

let nowIndex = 0;
let songList;
let musicControl;
let songRender;
let progressBar;
// let lrcControl;

getJsonMsg();


function getJsonMsg() {
    axios.get('/info').then(function (data) {
        if (data.data.code == 0) {
            songList = data.data.data;
            init(songList);
        }
    })
}
function init(_info) {
    songRender = new sR(_info);
    musicControl = new mC();
    bindEvent(_info);
    bindTouch();
    songRender.renderList(_info);
    renderSongsInfo(_info, nowIndex);
    // lrcControl = new lC(songList[nowIndex]['lrc']);
    // 
}

function btnCb(nowIndex) {
    renderSongsInfo(songList, nowIndex);
    musicControl.play(_utils.ezSizzle('.play-btn'));
    progressBar.init();
}

function bindEvent(_info) {
    mainBtnEvent();
    secondaryBtnEvent(_info);
}
function mainBtnEvent() {
    let len = songList.length;
    _utils.ezSizzle('.next-btn').onclick = function () {
        progressBar.stopTime();
        // 要放在渲染前，否则定时器重名后关不掉前一个
        nowIndex = calIndex(len, nowIndex, 1)
        btnCb(nowIndex);
    };
    _utils.ezSizzle('.prev-btn').onclick = function () {
        progressBar.stopTime();
        nowIndex = calIndex(len, nowIndex, -1)
        btnCb(nowIndex);
    };
    _utils.ezSizzle('.favourite-btn').onclick = function () {
        this.classList.toggle('fav');
    };
    _utils.ezSizzle('.play-btn').onclick = function () {
        this.classList.toggle('icon-play3');
        this.classList.toggle('icon-pause2');
        if (this.classList.contains('icon-play3')) {
            musicControl.pause(this);
            progressBar.pauseTime();
        } else if (this.classList.contains('icon-pause2')) {
            musicControl.play(this);
            progressBar.init();
        }
    }
}
function secondaryBtnEvent(_info) {
    _utils.ezSizzle('.list-btn').onclick = function () {
        _utils.ezSizzle('.list-box-wrapper').classList.toggle('on');
        _utils.ezSizzle('.close-btn-wrapper').classList.toggle('on');
    }
    _utils.ezSizzle('.close-icon').onclick = function () {
        _utils.ezSizzle('.list-box-wrapper').classList.toggle('on');
        _utils.ezSizzle('.close-btn-wrapper').classList.toggle('on');
    }
    _utils.ezSizzle('.list-for-append').onclick = function (e) {
        let a = e.target.getAttribute('index');
        nowIndex = +a;
        // 字符串a会使得程序混乱
        progressBar.stopTime();
        btnCb(nowIndex);
    }
    _utils.ezSizzle('.lrc-container').onclick = function (e) {
        let url = _info[nowIndex]['image'];
        _utils.ezSizzle('.bg-container').style.background = `url(${url}) no-repeat center`;
        _utils.ezSizzle('.bg-container').style.backgroundSize = `100% 100%`;
        _utils.ezSizzle('.bg-container').style.filter = 'blur(15px)';
        _utils.ezSizzle('.full-screen-lrc-wrapper').classList.add('on');
        // lrcControl.renderLrc(ezSizzle('.full-screen-lrc-wrapper'));        
    }
    _utils.ezSizzle('.full-screen-lrc-wrapper').onclick = function () {
        _utils.ezSizzle('.full-screen-lrc-wrapper').classList.remove('on');
    }
}



function bindTouch() {
    let _duration = songList[nowIndex]['duration'];
    _utils.ezSizzle('.move-progress').ontouchstart = function (e) {
        let _domWidth = this.offsetWidth;
        let startLeft = e.touches[0].clientX;
        let moveLeft = 0;
        let percent = 0;
        let nowPercent = 0;
        musicControl.pause(_utils.ezSizzle('.play-btn'));
        progressBar.pauseTime();
        nowPercent = musicControl.tellDuration() / _duration;

        this.ontouchmove = function (e) {
            moveLeft = e.touches[0].clientX;
            percent = nowPercent + (moveLeft - startLeft) / _domWidth;
            progressBar.updatePercent(percent);
            progressBar.renderNowTime(percent);
        }

        this.ontouchend = function () {
            let duration = percent * _duration;
            musicControl.jumpTo(_utils.ezSizzle('.play-btn'), duration);
            progressBar.init();
        }
    }
}


function renderSongsInfo(songList, nowIndex) {
    // console.log(nowIndex)
    // 静态资源渲染
    songRender.renderInfo(nowIndex);
    // 歌曲渲染
    musicControl.load(songList[nowIndex]['audio']);
    progressBar = new pB(songList[nowIndex]['duration'], songList[nowIndex]['lrc']);
}



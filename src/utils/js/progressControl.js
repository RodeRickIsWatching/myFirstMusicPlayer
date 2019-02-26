// import {ezSizzle, switchTime} from './utils.js'
// 10.16 已挂载到window上

// 计算每次调用时候的时间百分比
// 1.通过动画不断的移动进度条并增加百分比
// 2.跳动进度条时，通过百分比移动进度条(由music组件发送)
import { lrcControl as lC } from './lrcHandler.js'

function progressBar(_duration, _lrc) {
    this.duration = _duration;
    this.animation = null;
    this._startTime = 0;
    this._pauseTime = 0;
    this.percentage = 0;
    this.stopPercentage = 0;
    this.lrcControl = new lC(_lrc);
    this.lrcControl.init();
}

progressBar.prototype = {
    init: function () {
        this.timeWatching();
    },
    timeWatching: function () {
        this._startTime = new Date().getTime();
        this.percentage = 0;
        let _self = this;
        function frame() {
            let _nowTime = new Date().getTime();
            _self.percentage = _self.stopPercentage + (_nowTime - _self._startTime) / _self.duration / 1000;
            if (_self.percentage <= 1) {
                _self.renderNowTime(_self.percentage);
                // _self.progressBarMove(_self.percentage);
                _self.animation = window.requestAnimationFrame(frame);
            } else {
                window.cancelAnimationFrame(_self.animation);
                _utils.ezSizzle('.next-btn').click();
            }
        }
        frame();
    },
    renderNowTime: function (_percent) {
        // 计算进度条
        let nowPercent = -100 + _percent * 100;
        _utils.ezSizzle('.move-progress').style.transform = `translateX(${nowPercent}%)`;
        // 计算播放时间
        let nowDuration = _percent * this.duration;
        let nowTime = _utils.switchTime(nowDuration);
        _utils.ezSizzle('.start-duration').innerHTML = nowTime;
        // 
        this.lrcControl.lrcUpdate(nowDuration)
        // 播放动画
        // console.log(18* _percent * 100)
        let rotation = 18* _percent * 100;
        _utils.ezSizzle('.img-wrapper').style.transform = `rotate3d(0,0,1,${rotation}deg)`;
    },
    pauseTime: function () {
        window.cancelAnimationFrame(this.animation);
        this._pauseTime = new Date().getTime();
        this.stopPercentage += (this._pauseTime - this._startTime) / (this.duration * 1000);
    },
    stopTime: function () {
        window.cancelAnimationFrame(this.animation);
        this._startTime = 0;
        this._pauseTime = 0;
        this.percentage = 0;
        this.stopPercentage = 0;
        this.renderNowTime(this.percentage);
    },
    updatePercent: function (_percent) {
        this.stopPercentage = _percent;
    },
    // getLrc: function(_obj){
    //     console.log(_obj)
    // }
}

export { progressBar }
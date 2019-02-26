function musicControl() {
    this.audio = new Audio();
    this.status = 'pause';
}
musicControl.prototype = {
    load: function (_src) {
        this.audio.src = _src;
        this.audio.load();
    },
    pause: function (_dom) {
        this.audio.pause();
        this.status = 'pausing';
        _dom.setAttribute('audioStatus', 'pausing')
        changeIcon(_dom)        
    },
    play: function (_dom) {
        this.audio.play();
        this.status = 'playing';
        _dom.setAttribute('audioStatus', 'playing')
        changeIcon(_dom)
    },
    jumpTo: function (_dom, _time) {
        this.audio.currentTime = _time;
        this.play(_dom);
    },
    tellDuration: function(){
        return this.audio.currentTime
    }
}

export { musicControl }


function changeIcon(_dom){
    if (_dom.getAttribute('audioStatus') == 'playing') {
        _dom.classList.remove('icon-play3');
        _dom.classList.add('icon-pause2');
    } else {
        _dom.classList.remove('icon-pause2');
        _dom.classList.add('icon-play3');
    }
}
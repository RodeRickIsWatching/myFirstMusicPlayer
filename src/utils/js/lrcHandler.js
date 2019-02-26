import axios from 'axios'
import { lrcReg, ezSizzle } from './utils.js'


function lrcControl(url) {
    let _url = `http://localhost:1234/${url}`;
    this.a = new Promise(resolve => {
        axios.get(_url).then(function (data) {
            if (data.status == 200) {
                resolve(data.data)
            }
        })
    })

}
lrcControl.prototype = {
    init: function () {
        this.a.then(data => {
            this.lrcInfo = data;
            this.getLrc();
            this.renderLrc(ezSizzle('.lrc-container'));
            this.renderLrc(ezSizzle('.full-screen-lrc-container'));
            this.top = 0;
        })
    },
    getLrc: function () {
        this.tempLrc = lrcReg(this.lrcInfo)[0];
        this.lrcArr = lrcReg(this.lrcInfo)[1];
    },
    renderLrc: function (_dom) {
        // let strTemp = '';
        let count = 0;
        let strTemp = '<span style="height:60px"> </span><span style="height:60px"> </span>';
        strTemp += '<span>' + this.tempLrc.songName + '</span>';
        strTemp += '<span>' + this.tempLrc.singer + '</span>';
        strTemp += '<span>' + this.tempLrc.album + '</span>';
        for (let i in this.tempLrc) {
            if (!Object.is(+i, NaN)) {
                strTemp += '<span class=' + count + '>' + this.tempLrc[i] + '</span>';
                count++;
            }
        }
        _dom.innerHTML = strTemp;
    },
    lrcUpdate: function (_duration) {
        for (let i in this.lrcArr) {
            let toTop = -180;
            if (this.lrcArr[i] - _duration <= 0.02 && this.lrcArr[i] - _duration > 0) {
                let str = '.' + i;
                // toTop -= ezSizzle(str).offsetHeight * i;
                for (let j = 0; j < i; j++) {
                    let str = '.' + j;
                    toTop -= ezSizzle(str).offsetHeight;
                }
                // offsetHeight * i会有部分歌曲跳转混乱
                this.top = toTop;
                ezSizzle(str).classList.add('chosen');
                ezSizzle('.lrc-container').style.top = this.top + 'px';
            }
        }
    }
}


export { lrcControl }
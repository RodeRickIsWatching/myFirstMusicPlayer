// import {ezSizzle, switchTime} from './utils.js'
// 10.16 已挂载到window上

function songRender(_obj) {
    this.list = _obj;
}

songRender.prototype = {
    renderInfo: function (nowIndex) {
        this.renderStatic(nowIndex)
        this.renderImg(nowIndex)
        this.renderIsLike(nowIndex)
    },
    renderStatic: function (nowIndex) {
        _utils.ezSizzle('.song-info').innerHTML = this.list[nowIndex]['song'];
        _utils.ezSizzle('.singer-info').innerHTML = this.list[nowIndex]['singer'];
        _utils.ezSizzle('.end-duration').innerHTML = _utils.switchTime(this.list[nowIndex]['duration']);
    },
    renderImg: function (nowIndex) {
        let url = this.list[nowIndex]['image'];
        _utils.ezSizzle('.img-wrapper').style.background = `url(${url}) no-repeat`;
        // 注意这里url不能设置带有空格和符号的路径    
        _utils.ezSizzle('.img-wrapper').style.backgroundSize = `100% 100%`;
        _utils.ezSizzle('.background-wrapper').style.background = `url(${url}) no-repeat center`;
        _utils.ezSizzle('.background-wrapper').style.backgroundSize = `100% 100%`;
        _utils.ezSizzle('.background-wrapper').style.filter = 'blur(15px)';
    },
    renderIsLike: function (nowIndex) {
        if (this.list[nowIndex]['isLike']) {
            _utils.ezSizzle('.favourite-btn').classList.add('fav');
        } else {
            _utils.ezSizzle('.favourite-btn').classList.remove('fav');
        }
    },
    renderList: function (_list) {
        let str = '';
        for (let i in _list) {
            let songName = _list[i]['song'];
            let singer = _list[i]['singer'];
            str += `<li class='list-items' index=${i}><h2 class='song' index=${i}>${songName}</h2>
            <h2 class='singer' index=${i}>${singer}</h2></li>`
        }
        _utils.ezSizzle('.list-for-append').innerHTML = str;
    }

}
export { songRender }
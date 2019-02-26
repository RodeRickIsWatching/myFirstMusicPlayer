//1.计算上一首下一首的index
function calIndex(_len, _nowIndex, _dir) {
    let _newIndex = 0;
    if (_dir == 1) {
        _newIndex = (_len + _nowIndex + 1) % _len;
    } else if (_dir == -1) {
        _newIndex = (_len + _nowIndex - 1) % _len
    }
    return _newIndex;
}











export {calIndex}
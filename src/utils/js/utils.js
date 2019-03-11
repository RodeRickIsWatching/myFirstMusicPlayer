function ezSizzle(_dom, _oldAttr = "", _oldAttrValue = "", _newAttrValue = "") {
  // 简单获取id、class，还可以设置属性
  // 暂不支持li
  // 暂不支持通过自定义属性查找dom（因为没必要）
  let idReg = /\#[/s/S]*/g;
  let tagReg = /[/s/S]*/g;
  let classReg = /\.[/s/S]*/g;
  let otherReg = /&[/s/S]*/g;
  let domResult = null;
  if (classReg.test(_dom)) {
    let dom = _dom.replace(/\./g, "");
    domResult = document.getElementsByClassName(dom)[0];
  } else if (idReg.test(_dom)) {
    let dom = _dom.replace(/\#/g, "");
    domResult = document.getElementById(dom);
  } else if (tagReg.test(_dom)) {
    // let dom = _dom.replace(//g, '');
    domResult = document.getElementsByTagName(_dom)[0];
  }

  if (_oldAttr) {
    if (_newAttrValue) {
      let _oldValue = domResult.getAttribute(_oldAttr);
      let attrReg = new RegExp(_oldAttrValue, "g");
      _newValue = _oldValue.replace(attrReg, _newAttrValue);
      domResult.setAttribute(_oldAttr, _newValue);
    } else {
      domResult.setAttribute(_oldAttr, _oldAttrValue);
    }
  }
  return domResult;
}

function switchTime(_time, _aim = 0) {
  // 0 -> toTime ; 1 -> toDuration
  if (_aim == 0) {
    let min = parseInt(_time / 60);
    let sec = parseInt(_time - 60 * min);
    if (min < 10) {
      min = `0${min}`;
    }
    if (sec < 10) {
      sec = `0${sec}`;
    }
    let result = `${min}:${sec}`;
    return result;
  } else {
    let minReg = /\d+(?=:)/g;
    let secReg = /(?<=:)\d+/g;
    let duration = +_time.match(secReg) + _time.match(minReg) * 60;
    return duration;
  }
}

function fireEvent(dom, _name) {
  // 创建自定义事件
  let newEvent = document.createEvent("HTMLEvents");
  newEvent.initEvent(_name, false, false);
  dom.dispatchEvent(newEvent);
}

function lrcReg(data) {
  let songNameReg = /(?<=\[ti:)[\w\W]+?(?=])/g;
  let singerReg = /(?<=\[ar:)[\w\W]+?(?=])/g;
  let albumReg = /(?<=\[al:)[\w\W]+?(?=])/g;
  let tempReg = /[\[\d:.\]+][\s\S]+?(?=\n)/g;
  //   let tempReg = /[\[\d:.][\s\S]+?(?=\n)/g;
  let timeReg = /(?<=\[)[\d:.]+?(?=\][\w\W]+)/g;

  let song = data.match(songNameReg).toString();
  let singer = data.match(singerReg).toString();
  let album = data.match(albumReg).toString();
  let lrcArr = data.match(tempReg);
  console.log(data, lrcArr, 123);

  let lrcObj = {};
  let lrcIndex = [];
  lrcObj["songName"] = song;
  lrcObj["singer"] = singer;
  lrcObj["album"] = album;
  for (let i in lrcArr) {
    let _ele = lrcArr[i];
    let _word = _ele.replace(/\[[\d:.]+?\]/g, " ");
    let tempTime = _ele.match(timeReg) ? _ele.match(timeReg).toString() : "";
    let _tempDuration = switchTime(tempTime, 1);
    lrcObj[_tempDuration] = _word;
    lrcIndex.push(_tempDuration);
  }
  return limitLenth(lrcObj);
  //
}
function limitLenth(_obj) {
  let resultArr = [];
  let resultObj = {};
  for (let i in _obj) {
    if (_obj[i].length > 30) {
      let newIndex = +i + 1;
      let spaceIndex = Array.prototype.lastIndexOf.call(_obj[i], " ");
      if (spaceIndex > 30) {
        spaceIndex = Array.prototype.indexOf.call(_obj[i], " ", 30);
      }
      let newStrAft = Array.prototype.slice
        .call(_obj[i], spaceIndex + 1)
        .join("");
      let newStrPre = Array.prototype.slice
        .call(_obj[i], 0, spaceIndex)
        .join("");
      resultObj[i] = newStrPre;
      resultObj[newIndex] = newStrAft;
    } else {
      resultObj[i] = _obj[i];
    }
  }

  for (let i in resultObj) {
    if (!Object.is(NaN, +i)) {
      resultArr.push(+i);
    }
  }
  return [resultObj, resultArr];
}

export { ezSizzle, switchTime, fireEvent, lrcReg };

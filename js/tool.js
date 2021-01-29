function createDom(dom, styleArr, attributeObj){
    let oDom = document.createElement(dom);
    for(let i = 0; i < styleArr.length; i++){
        oDom.classList.add(styleArr[i]);
    }
    for(let value in attributeObj){
        oDom.style[value] = attributeObj[value];
    }
    return oDom;
}

function setLocal (key, value) {
    if(typeof value === 'object' && value !== null) {
      value = JSON.stringify(value);
    }
  
    localStorage.setItem(key, value);
  }
  
  function getLocal (key) {
    var value = localStorage.getItem(key);
    if(value === null) { return value};
    if(value[0] === '[' || value[0] === '{') {
      return JSON.parse(value);
    }
    return value;
  }
  
  function formatNum (num) {
    if(num < 10) {
      return '0' + num;
    }
  
    return num;
  }
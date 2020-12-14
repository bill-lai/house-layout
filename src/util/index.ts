// 获取唯一标识符
export const generateUUID = () => {
  let d = Date.now();

  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); 
  }

  let temp = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'

  var uuid = temp.replace(/[xy]/g, c => {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

  return uuid;
}

// 防抖
export const debounce = (fn: Function, mis: number = 16, handleArgs?: Function, firstHandle?: Function) => {
  let time = null
  let args = []
  let count = 0

  return (...arg) => {
    count || (firstHandle && firstHandle());
    count++
    args.push(arg)
    clearTimeout(time)
    time = setTimeout(() => {
      if (handleArgs) {
        fn(handleArgs(args))
        args = []
      } else {
        fn(...arg)
      }
      count = 0
    }, mis)
  }
}

// 节流
export const throttle = (fn, gapTime) => {
  let _lastTime = null;

  return function (...args) {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn(...args);
      _lastTime = _nowTime
    }
  }
}

// 获取类型
export const getType = (val: any) : string => {
  return Object.prototype.toString.call(val).slice(8, -1)
}

// 扩展方法
export const type : { [key in string]: { (val: any) : boolean } } = {};

let Types = ['String', 'Number', 'Boolean', 'Undefined', 'Null', 'Object', 'Function', 'Array', 'Date', 'RegExp']
Types.forEach(v => type[`is${v}`] = val => getType(val) === v)


/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 *        用url方式表示的base64图片数据
 */
export const convertBase64UrlToBlob = (urlData: string) => {
  var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// 获取字符串长度，1个中文=2个英文
export const strEascpeLen = (str: string) =>{ 
  let value = str;
  let length = value.length;

  for(let i = 0; i < length; i++){
    let valueEscape = escape(value.substr(i,1)); //编码
    ~valueEscape.indexOf('%u') && length++
  }
  return length;
 }
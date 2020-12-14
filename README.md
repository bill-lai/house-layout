# lasting-stack
对数据进行栈式管理，可以选用特定方式存储，比如cookie，sessionStorage，localStorage，或者自己服务器上

## 安装
```javascript
npm install lasting-stack
```

## 使用
```
import lastingStack from 'lasting-stack'

const stack = lastingStack({
  name: 'aa',
  decode: JSON.parse,
  encode: JSON.stringify
})

stack.push({ name: 'lzb', sex: 1 })
stack.push({ name: 'bill', sex: 1 })

// { name: 'lzb', sex: 1 }
stack.get(0)
// { name: 'bill', sex: 1 }
stack.pop()
```

## lastingStack API

### lastingStack([config [, isAsync])
构造一个stack对象，注意 <i>isAsync</i> 传入true与false返回对象不一样<br>
当 <i>isAsync</i> 为false时返回 [StorageStack](#StorageStack)
当 <i>isAsync</i> 为true时返回 [AyncStorageStack](#AyncStorageStack)

#### config
```
{
  // 标识符，注意如果需要持久化除了选用特定模式name值应该也要保存起来，
  // 下次传入即可恢复对象,如果不提供则每次都新建
  name?: 'aa',
  // 提供编码接口可以对持久化的数据进行编码，存储的对象即为编码后的数据
  encode?: JSON.stringify,
  // 提供解吗接口与encode相对应，每次获取数据进行解吗再返回
  decode?: JSON.parse
}
```

#### StorageStack
|  方法   | 说明  | 
|  ----  | ----  |
| push(data: T) : T | 向栈顶推入数据 |
| pop() : T | 栈定推出数据 |
| getData() : T | 获取栈顶数据 |
| get(index: number) : T | 获取指定位置的数据 |
| clear(): void | 清除栈数据 |


#### AyncStorageStack
|  方法   | 说明  | 
|  ----  | ----  |
| load(cb: function) : void | 栈初始化完成后的回调 |
| push(data: T) : Promise\<T\> | 向栈顶推入数据 |
| pop() : Promise\<T\> | 栈定推出数据 |
| getData() : Promise\<T\> | 获取栈顶数据 |
| get(index: number) : Promise\<T\> | 获取指定位置的数据 |
| clear(): Promise\<void\> | 清除栈数据 |



### lastingStack.setMode(mode)
设置栈存储的方式，mode为字符串，现在已提供 <i>object</i>，<i>cookie</i>，<i>sessionStorage</i>，<i>localStorage</i>  4种模式

|  mode   | 说明  | 
|  ----  | ----  |
| object | 内存中存储，不可持久化 |
| cookie | cookie中存储，可以持久化 |
| session | sessionStorage中存储，可以持久化，关闭标签后不可恢复 |
| local | localStorage中存储，可以持久化 |


### lastingStack.installMode(name, storage)
为lastingStack添加模式，添加后可在 [setMode](#lastingStack.setMode(mode))中使用<br>
name 为字符串，为模式的名称比如 <i>aliy</i><br>
storage 为 [Storage](#Storage)或[AyncStorage](#AyncStorage)对象

#### Storage
```
{
  // 删除一条栈元素
  removeItem: (key: string) => void,
  // 添加或是设置一条栈元素
  setItem: (key: string, val: T) => void,
  // 获取某条栈元素设置一条栈元素
  getItem: (key: string) => T
}
```
#### AyncStorage
```
{
  // 删除一条栈元素
  removeItem: (key: string) => Promise<void>
  // 添加或是设置一条栈元素
  setItem: (key: string, val: T) => Promise<void>,
  // 获取某条栈元素设置一条栈元素
  getItem: (key: string) => Promise<T>
}
```


# nqxb
学习jQuery源码时，模仿写出来的一个简易框架，实现了jQuery的部分核心功能
### 选择器
$()支持传入 `css语法选择器`、`html字符串`、`原生dom对象`、`原生dom对象集合`，得到框架包装对象
###入口函数
$()参数为函数时，可作为入口函数
###其他功能
模仿实现了jQuery的`extend方法`、`each方法`、`css操作`、`class操作`、`on事件绑定`、`append/prepend方法`等

# InputCount TextareaCount

单行，多行文本框文字输入个数统计，
单行，多行文本框限制输入文本个数,超出 maxLength 指定个数，输入文字将被截取
本控件仅限于 ant.design Form 中使用

## 说明

![组件示例](https://image-c.weimobwmc.com/wrz/bfcb6acb1136471aa459ed0674c2b86a.png)

**参数**

| 选项      | 描述                                                                                               | 类型     | 必填    | 默认值   |
| --------- | -------------------------------------------------------------------------------------------------- | -------- | ------- | -------- |
| maxLength | 最多输入字符个数                                                                                   | number   | `false` | 200      |
| ignore    | 是否区不分中文与非中文,进行无差别计数,默认 false，差别计算一个中文字符按 1 个计算，非中文 0.5 计算 | Boolean  | `false` | false    |
| onChange  | 输入值改变后的回调函数                                                                             | Function | `false` | () => {} |

**示例代码**

- 引用方式

```js
import UIKIT from 'saas-common-uikit';
const { InputCount } = UIKIT;
const { TextareaCount } = InputCount;
```

或者

```js
import { InputCount } from 'saas-common-uikit';
const { TextareaCount } = InputCount;
```

支持按需引用

```js
import InputCount from 'saas-common-uikit/lib/InputCount';
const { TextareaCount } = InputCount;
```

- 使用方法

```jsx
{
  getFieldDecorator('title', {
    rules: [
      {
        whitespace: true,
        required: true,
        message: '请填写备注标题',
      },
    ],
  })(<InputCount maxLength={20} />);
}
```

TextareaCount 使用方法

```jsx
{
  getFieldDecorator('title', {
    rules: [
      {
        whitespace: true,
        required: true,
        message: '请填写备注标题',
      },
    ],
  })(<TextareaCount maxLength={20} />);
}
```

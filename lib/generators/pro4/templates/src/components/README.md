项目中的组件,有些是直接从ant-pro项目中拖过来的.
ant-pro4跟新后都为ts文件,得替换成js文件

以下组件中,含有接口调用, 与dva modal数据交互的都会==标识==
1. 有组件跟新,务必跟新md文档, 并将组件在index.js中统一导出
2. 组件的单元测试在项目根目录下的test/components文件夹, 使用的是jest+enzyme

## API

### AdvancedTree
 给普通的Tree组件添加了自动生成树节点的功能
| 参数          | 说明         | 类型                            | 默认值 |
| --------------- | --------------- | ------------------------------- | ------ |
| treeData         | 树状数据(扁平结构)     | Array              | []      |
| treeDataSimpleMode        | 数据转换模式     | {id: 'id映射', pId: '父级id映射', title: '显示的节点标题映射', rootPid: '根id'}                       | {id: 'id', pId: 'parentId', title: 'title', rootPid: 0}      |
| ...others        | 同Tree(antd)组件     | -  | -      |
### Dialog
 主动调用的modal展示
 ```javascript
       Dialog.open({
        title: '工单优先级编辑',
        width: 600,
        formProps: {
          action: '/customer/ticket/updateTicketPriority',
          method: 'POST',
          onSubmitted: data => {
            if (data.code === 0) {
              message.success('操作成功!');
            }
          }
        },
        //这里的render函数不能用箭头函数,否则取不到props
        render({ props: { form: { getFieldDecorator } } }) {
          // 回调的是props
          getFieldDecorator('ticketId', { initialValue: ticketId });
          return (
            <Fragment>
              <Row gutter={16}>
                <Col>
                  <Form.Item label="工单优先级" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                    {getFieldDecorator('ticketPriority', {
                      initialValue: ticketPriority
                    })(
                      <Radio.Group name="ticketPriority">
                        <Radio value={0}>默认</Radio>
                        <Radio value={1}>紧急</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Fragment>
          )
        }
      })
 ```
 ###  Ellipsis
文本过长自动处理省略号，支持按照文本长度和最大行数两种方式截取。

| 参数    | 说明                                             | 类型    | 默认值 |
| ------- | ------------------------------------------------ | ------- | ------ |
| tooltip | 移动到文本展示完整内容的提示                     | boolean | -      |
| length  | 在按照长度截取下的文本最大字符数，超过则截取省略 | number  | -      |
| lines   | 在按照行数截取下最大的行数，超过则截取省略       | number  | `1`    |
### MutiAutoSelect
 | 参数    | 说明                                             | 类型    | 默认值 |
| ------- | ------------------------------------------------ | ------- | ------ |
| dataSource | 联想数据接口配置                     | Array | -      |
| transferResponse  | 数据转换成自己需要的格式 | Function: res => ({data, ...others})  | -      |
| valuePropName   | 自动生成的option的value映射  | string  | `value`    |
| valuePropId   | 自动生成的option的id映射       | string  | 'id'    |
| style   |  select组件的样式      | Style  | -    |

```javascript
//带特定接口的联想多选
export class AutoGetStaff extends React.Component {
    static defaultProps = {
      dataSource: ['/customer/user/getStaffInfoByUserName', (params) => ({method: 'POST', body: {...params, type: 1}})],
      transferResponse: (res) => ({data: res.data.employeeList || []}),
      valuePropName: 'userName',
      valuePropId: 'account',
      placeholder: '客服姓名',
      style:{ width: 200 }
    };
    render(){
       
        return(
            <AutoSelect {...this.props}/>
        )
    }
}
```
### ImagePreview
 图片预览组件,集成了viewjs, 单图多图预览独立组件
 单图预览提供ref主动调用,避免渲染过多dom节点
####  ImageListPreview
| 参数    | 说明                                             | 类型    | 默认值 |
| ------- | ------------------------------------------------ | ------- | ------ |
| items | 预览的图片数组                     | Array[{url:string}] | -      |
#### ImageSimplePreview
```javascript
    import {ImageSimplePreview} from 'components/'
    export default class Page extends React.Component{
        componentDidMount(){
            if (this.previewer) this.previewer.show({url: 'loveyou.img'})
        }
        render(){
         return <ImageSimplePreview ref={c=>this.previewer   = c}/>   
        }
    }
```
 ###  StepForm
步骤操作的表单

| 参数    | 说明                                             | 类型    | 默认值 |
| ------- | ------------------------------------------------ | ------- | ------ |
| onFinsh | 所有步骤完成时的回调                     | (values: 所有的子步骤表单域的getFieldsValue的合并) => void | -      |
| children  | StepForm.Item | StepForm.Item  | -      |
 ###  StepForm.StepItem
步骤操作的表单条目
包裹自定义的children, (一般是个form表单) 传入额外的props给children 
| 参数    | 说明                                             | 类型    | 默认值 |
| ------- | ------------------------------------------------ | ------- | ------ |
| count | 总共有几个步骤                     | number |  StepForm的children数量    |
| currentStep  | 当前是第几步 | number  | -      |
| goNext  | 下一步 | () => void  | -      |
| goPrev  | 上一步 | () => void   | -      |
| index  | 当前是第几个StepForm的children | number  | -      |
| active  | StepForm.Item | StepForm.Item  | -      |
| handleFinish  | 调用传入StepForm的onFinshhuidiao |  () => void | -      |

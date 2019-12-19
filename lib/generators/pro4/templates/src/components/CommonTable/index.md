---
title:
  en-US: CommonTable
  zh-CN: CommonTable
---
表格组件, 可用来简化表格的分页查询, 以及排序过滤等功能, 可替换AutoData 组件

```JavaScript
const columns = [
      {
        title: '所属部门',
        sorter: true,  // 显示列排序
        filter: true, //显示过滤
        ellipsis: 10, // 字段省略
        onlySearch: true,//默认不显示列表，只在查询条件里显示
        search: true,//默认input 查询
      },
      {
        title: '所属部门',
        sorter: true,  // 显示列排序
        filter: true, //显示过滤
        ellipsis: 10, // 字段省略
        dataIndex: 'deptName', 
        search: true,//默认input 查询
      },
      {
        title: '设备状态',
        sorter: true,
        filter: true,
        dataIndex: 'statusName',
        search: {
          fieldOption:{},// getFieldDecorator 第二个参数设置 rules:{}, initialValue:'' 等
          valueType: String,// 添加了valueType 字段的查询会拼在url上, 如果url上带查询条件话会回显到Form表单里面
          name: 'status', //当前列对应的查询字段
          label: '设备状态别名', //查询label 别名
          render: () => (  // 查询显示的render
            <Select style={{ width: '100%' }} placeholder="请选择" allowClear>
              <Option value="1">在线</Option>
              <Option value="2">离线</Option>
            </Select>
          ),
        },
        render: (statusName, record) => (
          <Badge status={`${record.status == 1 ? 'processing' : 'default'}`} text={statusName} />
        ),
      },
      {
        title: '上次登录时间',
        sorter: true,
        dataIndex: 'lastLoginTime',
        search: {
          name: 'lastLoginTimeStart, lastLoginTimeEnd', //日期选择对应的查询
          render: () => (
            <RangePicker
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
              style={{ width: '100%' }}
            />
          ),
        },
      }]

//其他查询

colums =[{
  dataIndex:'',
  search:{
    type: 'date' //默认添加一个 DatePicker 查询  
    type: 'rangeDate' 
    /*默认添加一个 RangePicker 查询 === 
        <RangePicker
          format="YYYY-MM-DD"
          placeholder={['开始日期', '结束日期']}
          style={{ width: '100%' }}
        />
    */
  }
}]



const props = {
      ref:commonTable => (this.commonTable = commonTable),// 获取表格当前引用, 可以调用 reload , clear, getValues 等方法
      className:styles.tdNoWrap,
      autoload: false, //第一次是否自动加载数据
      columns:columns,// 表格的列字段向前看 下面columns 
      dataSourceUrl:`${ENMUS.dataSource}?n=${this.state.count}`, //数据源, 每次发生改变后会自动重新加载数据
      dataFormat:(data)=>data,//格式化返回的data   data为dataSourceUrl 返回的数据
      autoRowSelection:{
        auto: true, //表格头部显示非受控多选框,通过onselectChange 监听改变
        selectAll, //selectAll 改变后表格会根据值, 自动变成全选或者非全选状态
        onClear: () => {
          //清空当前选中的状态, 监听清空按钮方法
        },
        onSelectChange: selectNumber => {
          //selectNumber 每次checkbox 勾选或取消后都会调用,  selectAll props 改变后也会调用此方法
        },
      },
      onRefresh:data => {
        //onRefresh 方法, 会在表格每次加载完毕数据后调用,  data为dataSourceUrl 返回的数据
      }
}
<CommonTable
      {...props}>
    {/* 
      children 区域放置操作按钮, 使操作按钮与模糊查询在同一行
    */}
</CommonTable>

```

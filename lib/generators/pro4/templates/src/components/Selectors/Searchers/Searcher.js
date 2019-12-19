import React from 'react';
import { Icon, Row, Col, Card, Modal, Radio, Checkbox, Spin } from 'antd';
import request from '@/utils/request';
import { StaffFinder } from '../Finders';
import { FullDeptTree } from '../../Trees';
import styles from './index.less';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

export default class StaffSearcher extends React.PureComponent {
  state = {
    staffs: [],
    staffLoading: false,
  };
  static defaultProps = {
    keyName: 'id',
    labelName: 'name',
    defaultName: 'defaultItem',
    listUrl: '/api/personnel/employees/getEmployeeByDepartment',
  };
  allStaffs = []
  componentDidMount() {
    this.setValueFromProps(this.props, true);
  }
  componentWillReceiveProps(nextProps) {
    this.setValueFromProps(nextProps);
  }
  setValueFromProps(props, firstTime) {
    const { defaultName } = this.props;
    defaultName &&
      props[defaultName] &&
      (firstTime ||
        JSON.stringify(props[defaultName]) != JSON.stringify(this.props[defaultName])) &&
      this.setState({ [defaultName]: props[defaultName] });
    JSON.stringify(props.value) != JSON.stringify(this.state.checkedValue) &&
      this.setState({ checkedValue: props.value });
  }
  getEmpsByDept = async deptId => {
    this.setState({ staffLoading: true });
    const { staffs } = this.state
    const { listUrl, listQuery, query = {}, keyName, labelName } = this.props
    const { code, data } = await request(listUrl, {
      params: { departmentId: deptId, ...(listQuery ? query : {})},
    });
    this.setState({ staffLoading: false });
    if (!code) {
      this.setState({ staffs: data});
      this.allStaffs = [...this.allStaffs, ...data.filter(item => this.allStaffs.findIndex(i => i[keyName] == item[keyName]) < 0)]
    }
  };
  showModal = () => {
    this.setState({ visible: true });
    if (!this.state.empGot) {
      this.getEmpsByDept();
      this.setState({ empGot: true });
    }
  };
  onTreeSelect = (selectedKeys, e) => {
    this.getEmpsByDept(~~selectedKeys);
    console.log('selectedKeys', selectedKeys);
    console.log('e', e);
  };
  onRadioCheck = e => {
    const { staffs } = this.state;
    const { defaultName } = this.props;
    this.setState({ [defaultName]: staffs.find(i => i.id == e.target.value) });
    this.props.onChange(e.target.value);
    setTimeout(() => this.setState({ visible: false }), 100);
  };
  onCheckBoxCheck = checkedValue => {
    this.setState({ checkedValue });
  };
  onOk = () => {
    const { checkedValue } = this.state;
    const { defaultName } = this.props;
    this.setState({ [defaultName]: this.allStaffs.filter(i => checkedValue.includes(i.id)) });
    this.props.onChange(checkedValue);
    this.setState({ visible: false, staffs: [] });
  };
  onCancel = () => {
    this.setState({ visible: false, staffs: [] });
  };
  render() {
    const { staffs, checkedValue } = this.state;
    const { defaultName, mode, finder, tree, finderProps: fp, ...restprops } = this.props;
    const multiple = mode == 'multiple';
    const finderProps = {
      ...restprops,
      ...fp,
      mode,
      showArrow: false,
      [defaultName]: this.state[defaultName],
      className: styles.searchInput,
    };
    const Group = multiple ? CheckboxGroup : RadioGroup;
    const onCheck = multiple ? this.onCheckBoxCheck : this.onRadioCheck;

    const modalProps = {
      title: '人员选择',
      className: styles.searchModal,
      visible: this.state.visible,
      onCancel: this.onCancel,
      destroyOnClose: true,
    };
    if (multiple) {
      modalProps.onOk = this.onOk;
    } else {
      modalProps.footer = null;
    }
    const Finder = finder || StaffFinder
    const Tree = tree || FullDeptTree
    return (
      <div className={styles.searcher} onChange={this.onChange}>
        <Finder {...finderProps} />
        <div className={styles.searchIcon} onClick={this.showModal}>
          <Icon type="down" />
        </div>
        <Modal {...modalProps}>
          <Row gutter={10}>
            <Col span={14}>
              <Card title="部门">
                <Tree query={restprops.query} onSelect={this.onTreeSelect} />
              </Card>
            </Col>
            <Col span={10}>
              <Card title="人员">
                <Spin spinning={this.state.staffLoading} style={{ height: 300 }}>
                  <Group
                    value={checkedValue}
                    onChange={onCheck}
                    className={styles.radios}
                    options={staffs.map(i => ({ value: i.id, label: i.name }))}
                  />
                </Spin>
              </Card>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

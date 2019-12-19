import React from 'react';
import { Icon, Row, Col, Card, Modal, Radio, Checkbox, Spin } from 'antd';
import { StaffFinder } from './Finders';
import { FullDeptTree } from '../Trees';
import request from '@/utils/request';
import styles from './index.less';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

export default class StaffSearcher extends React.PureComponent {
  state = {
    staffs: [],
    staffLoading: false,
  };
  static defaultProps = {
    defaultName: 'defaultItem',
  };
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
    const { code, data } = await request('/api/personnel/department/employee/', {
      params: { id: deptId },
    });
    this.setState({ staffLoading: false });
    code || this.setState({ staffs: data });
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
    const { checkedValue, staffs } = this.state;
    const { defaultName } = this.props;
    this.setState({ [defaultName]: staffs.filter(i => checkedValue.includes(i.id)) });
    this.props.onChange(checkedValue);
    this.setState({ visible: false });
  };
  onCancel = () => {
    this.setState({ visible: false });
  };
  render() {
    const { staffs, checkedValue } = this.state;
    const { defaultName, mode, ...restprops } = this.props;
    const multiple = mode == 'multiple';
    const finderProps = {
      ...restprops,
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
    };
    if (multiple) {
      modalProps.onOk = this.onOk;
    } else {
      modalProps.footer = null;
    }
    return (
      <div className={styles.searcher} onChange={this.onChange}>
        <StaffFinder {...finderProps} />
        <div className={styles.searchIcon} onClick={this.showModal}>
          <Icon type="down" />
        </div>
        <Modal {...modalProps}>
          <Row gutter={10}>
            <Col span={14}>
              <Card title="部门">
                <FullDeptTree onSelect={this.onTreeSelect} />
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

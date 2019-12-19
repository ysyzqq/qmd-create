import React, { Component } from 'react';
import { AutoComplete } from 'antd';
import request from '@/utils/request';

export default class SchoolInput extends Component {
  state = {
    data: [],
  };

  handleSearch = async value => {
    const res = await request(`/api/OfferProcess/gradInstitutions?key=${value}`);
    if (!res.code) {
      this.setState({
        data: res.data,
      });
    }
  };

  render() {
    const { data } = this.state;
    const { ...restProps } = this.props;
    return <AutoComplete dataSource={data} onSearch={this.handleSearch} {...restProps} />;
  }
}

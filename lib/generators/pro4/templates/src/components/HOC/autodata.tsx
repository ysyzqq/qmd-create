/* eslint-disable no-param-reassign */
/* eslint-disable no-undef-init */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-empty */
/* eslint-disable no-console */

import React, { PureComponent } from 'react';
import _ from 'lodash';
import request from '@/utils/request';

interface IOptions {
    request?: Function;
    url?: string;
    payload?: any;
    payloadFromProps?: Function;
    dataFilter?: Function;
    namespace?: string;
    [propname: string]: any;
}

export type TOptions = string | Function | IOptions;

const statusMsg = {
    0: 'unRequest',
    1: 'loading',
    2: 'done',
    '-1': 'error'
};

export default (options: TOptions) => {
    if (_.isString(options)) {
        options = { url: options };
    }
    if (_.isFunction(options)) {
        options = {
            requset: options
        };
    }
    options = _.merge(
        {
            namespace: '$data'
        },
        options
    );

    return (WrappedComponent: React.ElementType) =>
        class AutoData extends PureComponent<any, any> {
            public state = {
                loading: false,
                starting: true,
                data: undefined
            };

            public componentDidMount() {
                this.getData();
            }

            public getData = async () => {
                const {
                    request: ownRequest,
                    url = '',
                    payload: initPayload,
                    payloadFromProps,
                    dataFilter,
                    namespace,
                    ...restProps
                } = options as IOptions;
                this.setState({ loading: true });
                let res = null;
                let data = null;
                let payload = undefined;
                if (initPayload || payloadFromProps) {
                    payload = initPayload
                        ? initPayload
                        : (payloadFromProps as Function)(this.props);
                }
                try {
                    if (ownRequest) {
                        res = await ownRequest(payload);
                    } else {
                        res = await request(url, {
                            ...restProps,
                            body: payload
                        });
                    }
                    if (res.code === 0) {
                        data = _.isFunction(dataFilter) ? dataFilter(res.data) : res.data;
                    }
                    this.setState({
                        starting: false,
                        loading: false,
                        data
                    });
                } catch (e) {
                    this.setState({
                        starting: false,
                        loading: false
                    });
                }
            };

            public render() {
                const { namespace = '$data' } = options as IOptions;
                const autodata = {
                    [namespace]: {
                        ...this.state
                    }
                };
                return <WrappedComponent {...this.props} {...autodata} />;
            }
        };
};

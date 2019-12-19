import React, { RefObject } from 'react';
import debounce from 'lodash/debounce';

export default class RenderPosition extends React.PureComponent<any, any> {
  public warpRef: RefObject<HTMLDivElement>;
  public debounceCalc: () => void;
  public state = {
    domRect: {
      top: 0,
      bottom: 0,
    },
  };

  constructor(props: any) {
    super(props);
    this.warpRef = React.createRef<HTMLDivElement>();
    this.debounceCalc = () => {};
  }

  componentDidMount(): void {
    this.calcRect();
    this.debounceCalc = debounce(this.calcRect, 100);
    window.addEventListener('resize', this.debounceCalc);
  }

  calcRect = () => {
    // console.info('计算table高度')
    const current = this.warpRef.current;
    try {
      const rect = current && current.getClientRects();
      const top = rect && rect[0].top;
      const bottom = rect && rect[0].bottom;
      const innerHeight = window.innerHeight;
      this.setState({
        domRect: {
          top,
          bottom: innerHeight,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.debounceCalc);
  }

  render() {
    const { domRect } = this.state;
    const { children } = this.props;
    if (typeof children !== 'function') {
      return null;
    }
    return <div ref={this.warpRef}>{children(domRect)}</div>;
  }
}

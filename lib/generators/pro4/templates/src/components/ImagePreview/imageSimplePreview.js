import React from 'react';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.min.css';
import _ from 'lodash';
import { isImageUrl } from './utils';

export class ImageSimplePreview extends React.Component {
  viewer = null;
  state = {
    item: {},
  };

  show(item) {
    if (item && item.src && isImageUrl(item.src)) {
      this.setState(
        {
          item,
        },
        () => {
          if (this.viewer) this.viewer.show();
        },
      );
    }
  }

  hide() {
    if (this.viewer) {
      this.viewer.hide();
    }
  }

  componentDidMount() {
    if (this.container) {
      const ele = this.container;
      this.viewer = new Viewer(ele, {
        navbar: 0,
        toolbar: {
          zoomIn: 4,
          zoomOut: 4,
          reset: 4,
          rotateLeft: 4,
          rotateRight: 4,
          flipHorizontal: 4,
          flipVertical: 4,
        },
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevState.item, this.state.item)) {
      if (this.viewer) {
        this.viewer.update();
      }
    }
  }

  componentWillUnmount() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }

  render() {
    const { item } = this.state;
    return (
      <div ref={c => (this.container = c)} style={{ display: 'none' }}>
        <img {...item} />
      </div>
    );
  }
}

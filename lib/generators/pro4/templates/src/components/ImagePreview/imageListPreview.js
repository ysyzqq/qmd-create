import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import UploadList from 'antd/lib/upload/UploadList';
import 'antd/lib/upload/style/index';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.min.css';
import _ from 'lodash';
import { isImageUrl } from './utils';
// export default class ImagePreview extends UploadList { // 继承写法,得从源码里获取,不建议
//     renderUploadList = (ref) => {
//         console.info(1111)
//         const ele = new UploadList({...this.props}, {...this.context}).renderUploadList(ref);
//         const {children, ...others} = ele.props
//         console.info(children,'--')
//         return React.createElement(
//             'div',
//             {className: 'ysy'},
//             React.cloneElement(
//                 ele,
//                 {...others},
//                 React.Children.map(children, item => <div className="ysy-item">{item}</div>)
//             )
//         )
//     }
// }

export class ImageListPreview extends React.Component {
  viewer = null;

  onSimplePreview = file => {
    // console.info(file)
    if (this.viewer) {
      this.viewer.view(file.imgIndex || 0);
    }
  };

  validateItems(items = []) {
    if (!items || !items.length) return [];
    let imgIndex = 0;
    return items
      .filter(item => !!item.url)
      .map((item, i) => ({
        ...item,
        name: item.name || `文件${i}`,
        uid: item.uid || `${i}`,
        status: 'done',
        ...(isImageUrl ? { imgIndex: imgIndex++ } : null),
      }));
  }

  componentDidMount() {
    if (this.list) {
      const ele = ReactDOM.findDOMNode(this.list);
      this.viewer = new Viewer(ele, {
        navbar: 4,
        toolbar: {
          zoomIn: 4,
          zoomOut: 4,
          oneToOne: 4,
          reset: 4,
          prev: 4,
          play: 0,
          next: 4,
          rotateLeft: 4,
          rotateRight: 4,
          flipHorizontal: 4,
          flipVertical: 4,
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.items, this.props.items)) {
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
    const { items, size, ...others } = this.props;
    return (
      <Fragment>
        <UploadList
          {...others}
          ref={c => (this.list = c)}
          items={this.validateItems(items)}
          onPreview={this.onSimplePreview}
        />
      </Fragment>
    );
  }
}

ImageListPreview.defaultProps = {
  listType: 'picture-card',
  progressAttr: {
    strokeWidth: 2,
    showInfo: false,
  },
  items: [],
  showRemoveIcon: false,
  showPreviewIcon: true,
  locale: {
    uploading: '上传',
    previewFile: '预览',
    removeFile: '移除文件',
    uploadError: '上传失败',
  },
};
ImageListPreview.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string })).isRequired,
};

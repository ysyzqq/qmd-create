import React, { useState, useEffect, forwardRef } from 'react';
import { Upload, Icon, message, Button } from 'antd';
import _ from 'lodash';
import styles from './index.less';

export interface FileListProps {
  uid: string;
  name: string;
  status: string;
  url: string;
}

const SXYUpload = (props, ref) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [fileList, setFileList] = useState(props.value || []);
  useEffect(() => {
    setFileList(props.value || []);
  }, [props.value]);
  let {
    content,
    render,
    btnIcon,
    imgIcon,
    classname,
    btntext,
    maxfiledsNum, //可上传文件数上限
    maxFileSize, //文件大小限制
    btnId,
    value,
    onChange,
    ...restProps
  } = props;
  // fileList= value || fileList

  //上传限制
  const beforeUpload = file => {
    if (maxfiledsNum && fileList.length >= maxfiledsNum) {
      message.error(`至多上传${maxfiledsNum}个文件!`);
      setIsAllowed(false);
      return false;
    } else if (!!maxFileSize) {
      const isAllowed = file.size / 1024 / 1024 < maxFileSize;
      if (!isAllowed) {
        if(maxFileSize>=1){
          message.error(`文件不可大于${maxFileSize}MB!`);
        }else{
          message.error(`文件不可大于${maxFileSize*1024}KB!`)
        }
        
      }
      setIsAllowed(isAllowed);
      return isAllowed;
    }
    setIsAllowed(true);
    return true;
  };
  const handleChange = (...args) => {
    console.log(!isAllowed);

    if (!isAllowed) return;
    console.log('%cargs: ', 'font-size:15px;background-color: rgb(135, 208, 104);', args[0]);
    // const { onChange } = props;
    // onChange(...args);
    let {
      file: { response, name, status },
      fileList,
    } = args[0];
    fileList = (maxfiledsNum && fileList.slice(0, maxfiledsNum)) || fileList;
    setFileList(fileList);
    if (status === 'uploading') {
      setLoading(true);
    } else if (status === 'done') {
      setLoading(false);
      if (response && response.code === 0) {
        message.success(`${name}上传成功`);
        fileList = fileList.map(_ => {
          let file = {
            uid: _.uid,
            name: _.name,
            status: _.status,
            url: (_.response && _.response.data.url) || _.url,
          };
          return file;
        });
        setFileList(fileList);
        onChange && onChange(fileList);
      } else {
        message.error(`${name}上传失败`);
        fileList.pop();
        setFileList(fileList);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
    console.log('%cargs: ', 'font-size:15px;background-color: rgb(27, 122, 104);', fileList);
  };

  // const handleClickUpload =(file) => {
  //   request(`/wmc/upload`, {method: 'POST',data});
  // }
  const defaultProps = {
    // customRequest:handleClickUpload,
    action: '/wmc/upload', //公用上传接口地址
    listType: 'picture-card',
    headers: { accessKey: 5543130 },
    ...restProps,
  };
  const uploadBtn = (
    <Button id={btnId}>
      <Icon type="upload" />
      {btntext || '上传'}
    </Button>
  );
  const imgUpload = (
    <div className={styles[classname]}>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">{btntext || '选择图片'}</div>
    </div>
  );
  return (
    <Upload
      {...defaultProps}
      beforeUpload={beforeUpload}
      fileList={fileList}
      onChange={handleChange}
      ref={ref}
    >
      {(btnIcon && uploadBtn) ||
        (imgIcon && (fileList.length >= maxfiledsNum ? null : imgUpload)) ||
        (_.isFunction(render) ? render(props) : content)}
    </Upload>
  );
};
export default forwardRef(SXYUpload);

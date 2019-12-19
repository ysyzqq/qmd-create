import React, { useState, useEffect, forwardRef } from 'react';
import { Upload, Icon, message, Button, Modal } from 'antd';
import styles from './index.less';
import { init } from 'mc-jssdk';
import request from '@/utils/request';
import { UploadProps, UploadFile, UploadChangeParam, RcFile } from 'antd/lib/upload/interface';

export interface ISXYUpload extends UploadProps {
  text?: string;
  btnId?: string;
  maxLength?: number;
  action?: string;
  format?: string[];
  fileSize?: number;
  initialFileList?: UploadFile[];
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
const SXYUpload: React.FC<ISXYUpload> = (
  {
    text = '上传',
    btnId,
    onChange,
    listType = 'text',
    fileList = [],
    maxLength = 99,
    action = '/wmc/upload',
    format = [],
    fileSize,
    initialFileList = [],
    ...restProps
  },
  ref,
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [files, setFiles] = useState<UploadFile[]>(initialFileList);

  const hostname = window.location.hostname;
  const mediaUrl = hostname.includes('dev')
    ? 'https://api-dev.weimobwmc.com'
    : hostname.includes('qa')
    ? 'https://api-qa.weimobwmc.com'
    : hostname.includes('pl')
    ? 'https://api-pl.weimobwmc.com'
    : 'https://api.weimobwmc.com';

  // 请求获取 Token 接口

  const upload = init({
    mediaUrl,
    accessKey: 5543130,
    size: 0,
    // sliceSize: 20,
    getToken: () => {
      return request('/wmc/upload/token', {
        method: 'POST',
      }).then((res: any) => {
        if (res.code == 0 && res.data) {
          return {
            expireIn: 0,
            token: res.data.token,
          };
        }
        throw new Error(res.msg);
      });
    },
    // onProgress: this.handleProgress,
  });

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleChange = (info: UploadChangeParam) => {
    const {
      file,
      file: { response, name, status, originFileObj },
      fileList: listFiles,
      event,
    } = info;
    console.log({ info });
    handleBeforeUpload(file, []) && setFiles(listFiles);
    if (status === 'uploading') {
      setLoading(true);
      return;
    }
    if (status === 'done') {
      setLoading(false);
      if (response && response.code === 0) {
        message.success(`${name}上传成功`);
        onChange && onChange(info);
      } else {
        message.error(`${name}上传失败`);
      }
    }
  };

  const handleBeforeUpload = (file: UploadFile, flists: UploadFile[]) => {
    console.log('%cfile: ', 'font-size:15px;background-color: rgb(135, 208, 104);', file);
    let verifyFormat: boolean = true;
    let verifyFileSize: boolean = true;
    format.length > 0 && (verifyFormat = format.includes(file.type));
    fileSize && fileSize >= 0 && (verifyFileSize = fileSize * 1024 * 1024 > file.size);
    if (flists.length > 0) {
      if (!verifyFormat) {
        message.warning('请上传正确格式的文件');
      }
      if (!verifyFileSize) {
        message.warning('文件大小超出限制');
      }
    }
    return verifyFormat && verifyFileSize;
  };

  const handleRemove = (file: UploadFile) => {
    const remainFiles = files.filter(f => f.uid !== file.uid);
    setFiles(remainFiles);
    return true;
  };

  const renderUpload =
    listType === 'picture-card' ? (
      <div className={styles.uploadImg}>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div>{text}</div>
      </div>
    ) : (
      <Button id={btnId}>
        <Icon type="upload" />
        {text}
      </Button>
    );

  return (
    <>
      <Upload
        // customRequest={({ file }) => {
        //   upload(file);
        // }}
        beforeUpload={handleBeforeUpload}
        action={action}
        headers={{ accessKey: '5543130' }}
        onChange={handleChange}
        listType={listType}
        ref={ref}
        onPreview={handlePreview}
        fileList={files}
        {...restProps}
        className={styles.upload}
        onRemove={handleRemove}
      >
        {files.length < maxLength && renderUpload}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
        <img alt="" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default forwardRef(SXYUpload);

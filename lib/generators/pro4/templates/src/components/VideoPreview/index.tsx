import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Icon, message } from 'antd';
import DPlayer from 'react-dplayer';
import { DPlayerVideoQuality } from 'dplayer';
import styles from './index.less';

interface IVideoPreview {
  /* 视频url数组 */
  urls?: string[];
  /* 具有清晰度功能时的 quality二维数组 */
  qualityUrls?: DPlayerVideoQuality[][];
  /* 右侧顶部标题 */
  title?: string;
  /* 默认播放的url下标 */
  urlIndex?: number;
  onClose?: () => void;
}

export const VideoPreview: React.FC<IVideoPreview> = ({
  title,
  urls = [],
  qualityUrls = [[]],
  urlIndex = 0,
  onClose = () => {},
}) => {
  /* 是否可以播放 */
  const [canplay, setCanplay] = useState<boolean>(false);
  /* 播放状态 */
  const [playing, setPlaying] = useState<boolean>(false);
  /* 目前播放时间 */
  const [currentTime, setCurrentTime] = useState<number>(0);
  /* 正在播的urls数组的下标 */
  const [currentIdx, setCurrentIdx] = useState<number>(urlIndex);
  /* 播放器本身 */
  let dpSelf: any = null;
  const [dp, setDp] = useState<any>(null);
  /* 上集下集Dom元素的ref */
  const arrowRef = useRef<HTMLDivElement>(null);
  /* 是否需要切换清晰度 */
  const isQuality = qualityUrls[currentIdx] && qualityUrls[currentIdx].length > 0;

  useEffect(() => {
    const dplayerIconsLeft = document.querySelector('.dplayer-icons-left');
    dplayerIconsLeft &&
      arrowRef &&
      arrowRef.current &&
      dplayerIconsLeft.appendChild(arrowRef.current);
  }, [currentIdx]);

  const onLoad = dplayer => {
    console.log('onload');
    dpSelf = dplayer;
    setDp(dpSelf);
  };

  const onCanplay = () => {
    console.log('onCanplay');
    setCanplay(true);
  };

  const onPlay = () => {
    console.log('onplay');
    setPlaying(true);
  };

  const onPause = () => {
    console.log('onpause');
    setPlaying(false);
  };

  const onEnded = () => {
    console.log('end');
  };

  const onError = () => {
    console.log('error');
  };

  const onPlaying = () => {
    console.log('onPlaying');
    setCurrentTime(dpSelf.video.currentTime);
  };

  const seek = () => {
    dp.seek(10);
  };

  /* 上集下集 */
  const handleBackwardForward = (number: number) => {
    const nextIdx = currentIdx + number;
    const length = isQuality ? qualityUrls.length - 1 : urls.length - 1;
    if (nextIdx < 0 || nextIdx > length) {
      number > 0 ? message.warning('已无下集视屏') : message.warning('已无上集视屏');
      return;
    }
    console.log(nextIdx);
    setCurrentIdx(nextIdx);
  };

  const renderArrow = () => (
    <div ref={arrowRef} className={styles.arrow}>
      <Icon
        type="step-backward"
        theme="filled"
        style={{ color: '#fff' }}
        onClick={() => handleBackwardForward(-1)}
      />
      <Icon
        type="step-forward"
        theme="filled"
        style={{ color: '#fff' }}
        onClick={() => handleBackwardForward(1)}
      />
    </div>
  );

  const renderDPlayer = useCallback(
    () => (
      <div key={currentIdx}>
        <DPlayer
          // DPlayer options 类型定义 video.url 为必传参数  但有切换清晰度选项时时url是无效的，不必传的。
          // @ts-ignore
          options={{
            loop: false,
            video: {
              [isQuality ? 'quality' : 'url']: isQuality
                ? qualityUrls[currentIdx]
                : urls[currentIdx],
              defaultQuality: 0,
            },
            screenshot: true,
            autoplay: true,
            contextmenu: [],
          }}
          onLoad={onLoad}
          onPlay={onPlay}
          onCanplay={onCanplay}
          onPause={onPause}
          onEnded={onEnded}
          onError={onError}
          onPlaying={onPlaying}
        />
      </div>
    ),
    [currentIdx],
  );

  return (
    <>
      <div className={styles.mask}></div>
      <div className={styles.previewWrap}>
        <div className={styles.preview}>
          {renderDPlayer()}
          <div className={styles.title}>
            <div>{title}</div> <Icon type="close" onClick={onClose} />
          </div>
          {renderArrow()}
        </div>
      </div>
    </>
  );
};

interface IOpenVideoPreview {
  urls?: string[];
  qualityUrls?: DPlayerVideoQuality[][];
  title?: string;
  urlIndex?: number;
}

const openVideoPreview = (props: IOpenVideoPreview) => {
  const container = document.createElement('div');
  const onClose = () => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  };
  ReactDOM.render(<VideoPreview {...props} onClose={onClose} />, container);
  document.body.appendChild(container);
};

export default openVideoPreview;

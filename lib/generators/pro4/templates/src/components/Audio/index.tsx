import React from 'react';
import ReactHowler from 'react-howler';
import ReactDOM from 'react-dom';

import raf from 'raf'; // requestAnimationFrame polyfill
import { Button, Icon, Slider } from 'antd';
import styles from './index.less';

interface IAudioProps {
  urls: string[];
  defaultIndex: number;
  name: string;
  onClose: () => void;
}

interface IAudioState {
  playing: boolean;
  loaded: boolean;
  loop: boolean;
  mute: boolean;
  volume: number;
  duration: number;
  seek: number;
  current: number;
}

export class Audio extends React.Component<IAudioProps, IAudioState> {
  player: any = null;
  _raf: any = null;
  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      loaded: false,
      loop: false,
      mute: false,
      volume: 1.0,
      duration: 0.0,
      seek: 0.0,
      current: this.props.defaultIndex,
    };
  }

  componentWillUnmount() {
    this.clearRAF();
  }

  handleToggle = () => {
    this.setState({
      playing: !this.state.playing,
    });
  };

  handleOnLoad = () => {
    this.setState({
      loaded: true,
      duration: this.player.duration(),
    });
  };

  handleOnPlay = () => {
    this.setState({
      playing: true,
    });
    this.renderSeekPos();
  };

  handleOnEnd = () => {
    this.setState({
      playing: false,
    });
    this.clearRAF();
  };

  handleStop = () => {
    this.player.stop();
    this.setState({
      playing: false, // Need to update our local state so we don't immediately invoke autoplay
    });
    this.renderSeekPos();
  };

  handleLoopToggle = () => {
    this.setState({
      loop: !this.state.loop,
    });
  };

  handleMuteToggle = () => {
    this.setState({
      mute: !this.state.mute,
    });
  };

  renderSeekPos = () => {
    this.setState({
      seek: this.player.seek(),
    });
    if (this.state.playing) {
      this._raf = raf(this.renderSeekPos);
    }
  };

  clearRAF = () => {
    raf.cancel(this._raf);
  };

  calTime = num => {
    const hours = Math.floor(num / 3600);
    const minutes = Math.floor((num % 3600) / 60);
    const seconds = Math.floor((num % 3600) % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds,
    ).padStart(2, '0')}`;
  };

  handleStep = (step: number) => {
    this.setState({
      current: this.state.current + step,
    });
  };

  render() {
    const { urls = [], name } = this.props;
    const { current } = this.state;
    return (
      <div className={styles.audio}>
        <ReactHowler
          // src={['https://c-dev.weimobwmc.com/dev-OlXw/39016fdebb724a618c64bcd05f30938e.mp3']}
          src={[urls[current]]}
          playing={this.state.playing}
          onLoad={this.handleOnLoad}
          onPlay={this.handleOnPlay}
          onEnd={this.handleOnEnd}
          loop={this.state.loop}
          mute={this.state.mute}
          volume={this.state.volume}
          ref={ref => {
            this.player = ref;
          }}
        />
        <Icon
          type="step-backward"
          theme="filled"
          className={styles.stepIcon}
          onClick={() => this.handleStep(-1)}
        />

        <Icon
          type={this.state.playing ? 'play-circle' : 'pause-circle'}
          theme="filled"
          onClick={this.handleToggle}
          className={styles.playIcon}
        />

        <Icon
          type="step-forward"
          theme="filled"
          className={styles.stepIcon}
          onClick={() => this.handleStep(1)}
        />

        <div className={styles.centerInfo}>
          <div className={styles.info}>
            <div>{name}</div>
            <div>
              {this.state.seek !== undefined ? this.calTime(this.state.seek) : '00:00:00'}/
              {this.state.duration ? this.calTime(this.state.duration) : '00:00:00'}
            </div>
          </div>
          <Slider
            min={0}
            max={this.state.duration}
            step={0.05}
            value={this.state.seek}
            className={styles.progress}
            onChange={value => {
              this.setState({ seek: value as number });
              this.player.seek(value);
            }}
          />
        </div>

        <div className={styles.volume}>
          <Icon type="sound" theme="filled" />
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={this.state.volume}
            className={styles.volumeSlider}
            onChange={value => this.setState({ volume: value as number })}
          />
        </div>
      </div>
    );
  }
}

interface IOpenAudio {
  urls: string[];
  defaultIndex: number;
  name: string;
}

const openAudio = (props: IOpenAudio) => {
  const container = document.createElement('div');
  const onClose = () => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  };
  ReactDOM.render(<Audio {...props} onClose={onClose} />, container);
  document.body.appendChild(container);
};

export default openAudio;

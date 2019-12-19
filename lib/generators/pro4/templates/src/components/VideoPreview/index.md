### openVideoPreview (主动打开视屏播放组件，支持上下集切换，清晰度切换.)

##### 属性

    - urls:视屏播放的url数组
    - qualityUrls:具有清晰度切换功能时提供的url数组,参数格式参照DPlayer
    - title:左上角标题
    - urlIndex:默认播放的数组下标,默认是0

##### 注意事项：

    > urls与qualiyUrls只需提供一个,如果同时提供urls 和 qualityUrls, 以qualityUrls为主,qualityUrls非正常格式时,切换至urls

##### 基本使用方式：

```JavaScript
 openVideoPreview({
      urls: [
        'http://static.smartisanos.cn/common/video/t1-ui.mp4',
        'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
        'http://static.smartisanos.cn/common/video/t1-ui.mp4',
      ],
      qualityUrls: [
        [
          {
            name: 'HD',
            url: 'http://static.smartisanos.cn/common/video/t1-ui.mp4',
          },
          {
            name: 'SD',
            url:
              'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
          },
        ],
        [
          {
            name: 'HAAAD',
            url: 'http://static.smartisanos.cn/common/video/t1-ui.mp4',
          },
          {
            name: 'SD',
            url:
              'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
          },
        ],
        [
          {
            name: 'HD',
            url: 'http://static.smartisanos.cn/common/video/t1-ui.mp4',
          },
          {
            name: 'SD',
            url:
              'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
          },
        ],
      ],
    });
```

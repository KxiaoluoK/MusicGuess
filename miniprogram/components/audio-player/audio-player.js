// 音频播放组件 — 处理音乐片段的播放、暂停、重放
const { MAX_REPLAY_COUNT } = require('../../utils/constants');

Component({
  properties: {
    // 音频文件路径
    src: {
      type: String,
      value: ''
    },
    // 是否自动播放
    autoplay: {
      type: Boolean,
      value: false
    },
    // 外部控制：要求播放
    playTrigger: {
      type: Number,
      value: 0
    }
  },

  data: {
    isPlaying: false,
    hasPlayed: false,        // 是否已经播放过至少一次
    replayCount: 0,          // 已重听次数
    maxReplay: MAX_REPLAY_COUNT,
    canReplay: true,
    duration: 0,
    currentTime: 0,
    progress: 0
  },

  observers: {
    'playTrigger': function() {
      this.play();
    },
    'src': function(newSrc) {
      // 音频源变化时重置一切状态
      this.destroyAudio();
      if (newSrc) {
        this.initAudio();
      }
      this.setData({
        hasPlayed: false,
        replayCount: 0,
        isPlaying: false,
        currentTime: 0,
        progress: 0
      });
    }
  },

  lifetimes: {
    attached() {
      if (this.properties.src) {
        this.initAudio();
      }
    },
    detached() {
      this.destroyAudio();
    }
  },

  pageLifetimes: {
    hide() {
      // 页面切后台时暂停
      this.pause();
    }
  },

  methods: {
    initAudio() {
      const audio = wx.createInnerAudioContext();
      audio.src = this.properties.src;
      audio.autoplay = false;

      audio.onCanplay(() => {
        this.setData({ duration: audio.duration });
      });

      audio.onPlay(() => {
        this.setData({ isPlaying: true });
      });

      audio.onPause(() => {
        this.setData({ isPlaying: false });
      });

      audio.onStop(() => {
        this.setData({ isPlaying: false });
      });

      audio.onEnded(() => {
        this.setData({ isPlaying: false });
      });

      audio.onTimeUpdate(() => {
        const currentTime = audio.currentTime;
        const duration = audio.duration || 1;
        this.setData({
          currentTime,
          progress: Math.min((currentTime / duration) * 100, 100)
        });
      });

      audio.onError((err) => {
        console.error('音频播放错误:', err);
        this.setData({ isPlaying: false });
        this.triggerEvent('error', { error: err });
      });

      this._audio = audio;

      if (this.properties.autoplay) {
        this.play();
      }
    },

    destroyAudio() {
      if (this._audio) {
        this._audio.destroy();
        this._audio = null;
      }
    },

    play() {
      if (!this._audio || !this.properties.src) return;

      // 检查重听次数
      if (this.data.hasPlayed && this.data.replayCount >= this.data.maxReplay) {
        wx.showToast({ title: '重听次数已用完', icon: 'none', duration: 1500 });
        return;
      }

      if (this.data.hasPlayed) {
        this.setData({ replayCount: this.data.replayCount + 1 });
      }

      this._audio.seek(0);
      this._audio.play();
      this.setData({ hasPlayed: true });
    },

    pause() {
      if (this._audio) {
        this._audio.pause();
      }
    },

    togglePlay() {
      if (this.data.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },

    replay() {
      if (this.data.replayCount >= this.data.maxReplay) {
        wx.showToast({ title: '重听次数已用完', icon: 'none', duration: 1500 });
        return;
      }
      this.play();
      this.triggerEvent('replay');
    }
  }
});

class ProgressFaker {
  constructor() {
    this.speed = 0.025;
    this.total = 0;
    this.isCompleted = false;
    this.timer = null;
  }

  startProcess(callback) {
    let stepSize = 0;

    this.timer = setInterval(() => {
      stepSize = (100 - this.total) * this.speed;
      this.total += stepSize;

      if (this.total >= 100 && this.isCompleted) {
        clearInterval(this.timer);
      } else {
        const n = Math.round(this.total);
        callback(n >= 100 && !this.isCompleted ? 99 : n);
      }
    }, 250);
  }

  completeProcess() {
    this.isCompleted = true;
    this.speed = 0.6;
  }

  // 根据进度情况，不同的速度
  // _changeSpeedByProgress(total) {
  //   if (total >=)
  // }
}

export default ProgressFaker;

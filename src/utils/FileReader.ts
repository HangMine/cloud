

class FileReaderWithPromise {
  reader: InstanceType<typeof FileReader>;
  constructor() {
    this.reader = new FileReader();
  }
  onload() {
    return new Promise((resolve, reject) => {
      this.reader.onload = () => {
        resolve(this.reader.result);
      };
    });
  }
  readAsArrayBuffer(blob: Blob) {
    this.reader.readAsArrayBuffer(blob);
    return this.onload();
  }
}

export default FileReaderWithPromise;

import JSZip from 'jszip'
import { ElLoading } from 'element-plus'

export function useUnpacker() {
  const downloadLink = ref('')
  const unpackerProgress = ref(0)
  const downloadSize = ref('')
  function checkRequirements() {
    try {
      const fr = new FileReader()
      if (Uint8Array !== undefined
          && Blob !== undefined
          && ArrayBuffer !== undefined
          && fr.readAsArrayBuffer !== undefined
          && window.URL !== undefined
          && window.URL.createObjectURL !== undefined)
        return true
    }
    catch (ex) {}

    return false
  }

  class FileUtils {
    static getIntAt(arr: Uint8Array, offs: number): number {
      return (
        (arr[offs + 3] << 24)
        + (arr[offs + 2] << 16)
        + (arr[offs + 1] << 8)
        + arr[offs + 0]
      )
    }

    static getWordAt(arr: Uint8Array, offs: number): number {
      return (arr[offs + 1] << 8) + arr[offs + 0]
    }
  }

  class PkgReaderV1 {
    private readPtr: number
    private fileCount: number

    constructor() {
      this.readPtr = 9
      this.fileCount = 0
    }

    private readInt(arr: Uint8Array): number {
      const value = FileUtils.getIntAt(arr, this.readPtr)
      this.readPtr += 4
      return value
    }

    private readWord(arr: Uint8Array): number {
      const value = FileUtils.getWordAt(arr, this.readPtr)
      this.readPtr += 2
      return value
    }

    private readStr(arr: Uint8Array): string {
      const offs = this.readPtr
      const length = this.readInt(arr)
      const arrString = arr.slice(offs + 4, offs + 4 + length)

      this.readPtr += length

      const string = new TextDecoder('utf-8').decode(arrString)
      return string
    }

    private readBinary(arr: Uint8Array): Uint8Array {
      const offs = this.readPtr
      const length = this.readInt(arr)
      const binaryData = arr.slice(offs + 4, offs + 4 + length)

      this.readPtr += length
      return binaryData
    }

    private async readFile(content: Uint8Array, offset: number, length: number): Promise<Blob> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const result = new Blob([content.slice(offset, offset + length)])
            resolve(result)
          }
          catch (ex) {
            reject(ex)
          }
        }, 100)
      })
    }

    public readVersionString(content: Uint8Array): string {
      this.readPtr = 0
      this.fileCount = 0

      // Check version
      const version = this.readStr(content)
      return version
    }

    public decodeFile(content: Uint8Array): void {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        customClass: 'upload-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      this.readPtr = 0
      this.fileCount = 0

      // Check version
      const version = this.readStr(content)
      if (!['PKGV0001', 'PKGV0002', 'PKGV0003', 'PKGV0004'].includes(version)) {
        // console.error('Decoder does not support this pkg version')
        // return
      }

      const files: { name: string; offset: number; size: number; content?: Blob }[] = []
      this.fileCount = this.readInt(content)

      for (let i = 0; i < this.fileCount; i++) {
        const file = {
          name: this.readStr(content),
          offset: this.readInt(content),
          size: this.readInt(content),
        }
        files.push(file)
      }

      const filesToRead = files.slice(0)
      let count = 1

      const onComplete = () => {
        const zip = new JSZip()
        files.forEach((file) => {
          zip.file(file.name, file.content!)
        })

        zip.generateAsync({ type: 'blob' }).then((content) => {
          downloadLink.value = window.URL.createObjectURL(content)
          downloadSize.value = (content.size / 1024).toFixed(1)

          loading.close()
          // const a = document.createElement('a')
          // a.href = url
          // a.className = 'btn btn-primary'
          // a.download = 'scene.zip'
          // a.innerText = `Download Scene.zip (${(content.size / 1024).toFixed(1)}KB)`

          // const downloadLink = document.getElementById('downloadlink')
          // if (downloadLink) {
          //   downloadLink.innerHTML = ''
          //   downloadLink.appendChild(a)
          // }
        })
      }

      const readNextFile = () => {
        if (filesToRead.length > 0) {
          const file = filesToRead.shift()
          // `${count++}/${files.length}`
          unpackerProgress.value = (count++ / files.length) * 100
          file!.content = new Blob([content.slice(this.readPtr + file!.offset, this.readPtr + file!.offset + file!.size)])
          setTimeout(readNextFile, 50)
        }
        else {
          onComplete()
        }
      }
      setTimeout(readNextFile, 100)
    }
  }

  return {
    checkRequirements,
    FileUtils,
    PkgReaderV1,
    downloadLink,
    downloadSize,
    unpackerProgress,
  }
}

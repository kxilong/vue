class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb
    Dep.target = this
    this.oldValue = vm[key]
    Dep.target = null
  }
  update() {
    // 获取新值
    let newValue = this.vm[this.key]
    if (this.oldValue == newValue) return
    this.oldValue = newValue
    this.cb(newValue)
  }
}

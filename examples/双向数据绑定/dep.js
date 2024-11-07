class Dep {
  constructor() {
    this.subs = []
  }
  addSubs(sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
    console.log(this.subs)
  }
  notify() {
    this.subs.forEach(item => {
      item.update()
    })
  }
}

var fs = require('fs')

var houseFilePath = 'db/ishangzu.json'

const loadHouse = () => {
    const content = fs.readFileSync(houseFilePath, 'utf8')
    const ms = JSON.parse(content)
    return ms
}

var h = {
    data: loadHouse()
}

h.all = function() {
    var hs = this.data
    return hs
}

// 导出一个对象的时候用 module.exports = 对象 的方式
// 这样引用的时候就可以直接把模块当这个对象来用了(具体看使用方法)
module.exports = h

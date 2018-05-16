const house = require('../model/house')


var all = {
    path: '/api/house/all',
    method: 'get',
    func: function(request, response) {
        var hs = house.all()
        var r = JSON.stringify(hs)
        response.send(r)
    }
}

var routes = [
    all,
]

module.exports.routes = routes

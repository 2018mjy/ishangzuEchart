//echarts
const chartStore = {
    pie: null,
    bar: null,
    line: null,
}

//租房数量/地区 饼状图
const optionForPie = function(data) {
    var option = {
        title: {
            text: '爱上租租房数量城区占比',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: '城区占比',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }

    return option
}

const optionForArea = function(area) {
    const data = _.map(area, (v, k) => {
        const o = {
            name: k,
            value: v.length,
        }
        return o
    })
    const option = optionForPie(data)
    return option
}

//租金/地区 柱状图
const optionForBar = function(data) {
    const option = {
        title: {
            text: '爱上租租房数量按租金价格区域划分',
        },
        "tooltip": {
            "trigger": "axis",
            "axisPointer": {
                "type": "cross",
                "crossStyle": {
                    "color": "#384757"
                }
            }
        },
        xAxis: {
            data: data.axis,
            name: '房租区域',
            axisLabel: {
                textStyle: {
                    color: '#000'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            name: '租房数量',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            }
        },
        series: [
            {
                type: 'bar',
                itemStyle: {
                    normal: {color: 'rgba(0,0,0,0.05)'}
                },
                barGap:'-100%',
                barCategoryGap:'40%',
                animation: false
            },
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#2378f7'},
                                {offset: 0.7, color: '#2378f7'},
                                {offset: 1, color: '#83bff6'}
                            ]
                        )
                    }
                },
                data: data.data
            }
        ]
    }
    return option
}

const optionForPrice = function(price) {
    const data = {
        axis: [],
        data: [],
    }
    _.each(price, (v, k) => {
        data.axis.push(k)
        data.data.push(v.length)
    })
    const option = optionForBar(data)
    return option
}


const optionForLine = function(data) {
    const option = {
        title: {
            text: '爱上租平均租金按地区划分对比图'
        },
        "tooltip": {
            "trigger": "axis",
            "axisPointer": {
                "type": "cross",
                "crossStyle": {
                    "color": "#384757"
                }
            }
        },
        xAxis: {
            name: '城区',
            type: 'category',
            data: data.axis,

        },
        yAxis: {
            type: 'value',
            name: '平均租金',
            boundaryGap: [0, '100%'],

            min: 0,
        },
        series: [{
            name: '模拟数据',
            type: 'line',

            data: data.data,
        }]
    };
    return option
}

const optionForRegion = function(region) {
    const data = {
        axis: [],
        data: [],
    }
    _.each(region, (v, k) => {
        var argpriceSum = 0
        console.log(v)
        for (var i = 0; i < v.length; i++) {
            argpriceSum += v[i].price / v[i].area
        }
        var argPrice = argpriceSum / v.length
        data.axis.push(k)
        data.data.push(argPrice)
    })
    const option = optionForLine(data)
    return option
}

function clone(obj){
    function Fn(){}
    Fn.prototype = obj;
    var o = new Fn();
    for(var a in o){
        if(typeof o[a] == "object") {
            o[a] = clone(o[a]);
        }
    }
    return o;
}

const groupByPrice = (data) => {

    const d = data.map((v, t) => {
        //这里需要clone每个对象才不会改变原数组
        let newObj = clone(v)
        if (newObj.price < 1500) {
            newObj.price = '1500元以下'
        } else if (newObj.price >= 1500 && newObj.price < 2000) {
            newObj.price ='1500-2000元'
        } else if (newObj.price >= 2000 && newObj.price < 2500) {
            newObj.price = '2000-2500元'
        } else if (newObj.price >=2500 && newObj.price < 3500) {
            newObj.price = '2500-3500元'
        } else if (newObj.price >=3500 && newObj.price < 4500) {
            newObj.price = '3500-4500元'
        } else if (newObj.price >= 4500) {
            newObj.price = '4500元以上'
        }
        return newObj
    })
    console.log(d+'1111111111111')
    const newdata = _.groupBy(d, 'price')
    return newdata

}

const renderChart = function(d) {
    const data = d

    const area = _.groupBy(data, 'region')
    const areaOption = optionForArea(area)
    const pie = chartStore.pie
    pie.setOption(areaOption)

    const priceData = groupByPrice(data)
    const priceOption = optionForPrice(priceData)
    const bar = chartStore.bar
    bar.setOption(priceOption)


    const yearOption = optionForRegion(area)
    const line = chartStore.line
    line.setOption(yearOption)

}

const fetchHouses = function() {
    //使用 ajax 动态获取数据
    api.fetchHouses(function (d) {
        d = JSON.parse(d)
        renderChart(d)
    })

}


const initedChart = function() {
    _.each(chartStore, (v, k) => {
        const element = document.getElementById(k)
        const chart = echarts.init(element)
        chartStore[k] = chart
    })
}

const __main = function() {
    initedChart()
    fetchHouses()
}

// $(document).ready() 这个东西是 jQuery 的回调函数
// 是页面内容(只包括元素, 不包括元素引用的图片)载入完毕之后的回调事件
$(document).ready(function() {
    __main()
})

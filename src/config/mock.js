const Mock = require('mockjs')
//使用mockjs模拟数据
Mock.mock('this.INTERFACE.getLevelTAssetsCount', (req, res) => {
    return {
        data: {
            "count" : 2
        }
    }
})
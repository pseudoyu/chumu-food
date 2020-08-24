// pages/takeout/takeout.js
var Zan = require('../../wxss/dist/index');
const config = require('./config');
const app = getApp()
const timer = null
const eatMap = {
    "披萨配意面": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/pizza.png",
    "牛排红酒": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/niupai.png",
    "饺子馄饨": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/jiaozi.png",
    "汉堡可乐薯条": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/hanbao.png",
    "串串": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/chuanchuan.png",
    "火锅": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/huoguo.png",
    "香锅": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/xiangguo.png",
    "烧烤": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/shaokao.png",
    "东南亚菜": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/dongnanyacai.png",
    "日式料理": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/riliao.png",
    "韩式料理": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/hanliao.png",
    "家常便当": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/biandang.png",
    "茶餐厅": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/chacanting.png",
    "川湘菜": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/chuancai.png",
    "轻食沙拉": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/qingshi.png",
    "江浙菜": "cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/jiangzhe.png"
}

Page(Object.assign({}, Zan.TopTips, {
    data: {
        config,
        dishesObjects: null,
        dish: "今天吃什么呢",
        keyword: '',
        isProcess: false,
        motto: 'Hello World',
        count: 0,
        loading: true,
        budget: ["不限", "随便凑合", "大吃一顿"],
        budgetIndex: 0,
        eatType: ["不限", "早餐", "午餐", "晚餐", "夜宵"],
        eatTypeIndex: 0,
        nowEat: 'cloud://chumufood-a9vja.6368-chumufood-a9vja-1301761264/eat/logo.png'
    },
    //事件处理函数
    onPeopleChange(e) {
        this.showTopTips();
        this.setData({
            peopleIndex: e.detail.value
        });
    },
    onBudgetChange(e) {
        this.showTopTips();
        this.setData({
            budgetIndex: e.detail.value
        });
    },
    onEatTypeChange(e) {
        this.showTopTips();
        this.setData({
            eatTypeIndex: e.detail.value
        });
    },
    bindClickTap: function () {
        var that = this
        clearInterval(this.data.timer);
        if (this.data.isProcess) {
            console.log("停止")
            this.setData({
                nowEat: eatMap[this.data.keyword],
                isProcess: false,
            })

        } else {
            console.log("开始")

            console.log(that.data.dishesObjects.length)
            var newDishes = that.dishesFillter(
                that.data.dishesObjects,
                that.data.budgetIndex,
                that.data.eatTypeIndex
            );
            if (newDishes.length > 0) {
                this.setData({
                    isProcess: true
                })
                this.data.timer = setInterval(function () {
                    var randomIndex = Math.floor((Math.random() * 100 % newDishes.length))
                    var dishObject = newDishes[randomIndex]
                    if (!newDishes[randomIndex].keyword) {
                        newDishes[randomIndex].keyword = newDishes[randomIndex].name
                    }
                    that.setData({
                        dish: newDishes[randomIndex].name,
                        keyword: newDishes[randomIndex].keyword,
                        nowEat: '../../images/random.gif'
                    })
                }, 10);
            } else {
                wx.showModal({
                    title: '提示',
                    content: '菜单为空',
                    showCancel: false
                })
            }
        }
    },
    onLoad: function () {
        this.checkUpdate();
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    showTopTips() {
        //this.showZanTopTips('条件选择暂时没法用，因为还没写完，我传上来看看效果');
    },
    //根据条件筛选出合适的列表
    dishesFillter(dishObjects, budgetIndex, eatTypeIndex) {
        console.log("筛选", budgetIndex, eatTypeIndex)
        var newDishes = new Array()
        //对每个美食进行过滤
        for (var dishObjectIndex in dishObjects) {
            var pass = true;
            var dishObject = dishObjects[dishObjectIndex]
            //判断消费类型
            switch (parseInt(budgetIndex)) {
                case 1:
                    //判断是否为“随便凑合”
                    if (!(dishObject.level === 1)) pass = false
                    break;
                case 2:
                    //判断是否为“大吃一顿”
                    if (!(dishObject.level === 2)) pass = false
                    break;
                default:
            }
            //判断就餐类型
            switch (parseInt(eatTypeIndex)) {
                case 1:
                    //判断是否为早餐
                    if (!dishObject.breakfast) pass = false
                    break;
                case 2:
                    //判断是否为午餐
                    if (!dishObject.lunch) pass = false
                    break;
                case 3:
                    //判断是否为晚餐
                    if (!dishObject.dinner) pass = false
                    break;
                case 4:
                    //判断是否为夜宵
                    if (!dishObject.night) pass = false
                    break;
                default:
            }
            if (!dishObject.on) {
                pass = false
            }
            //如果通过筛选则加到数组中
            if (pass) {
                newDishes.push(dishObject)
            }
        }
        return newDishes
    },
    getDishesObjects() {
        var that = this
        wx.getStorage({
            key: 'dishesObjects',
            success: function (res) {
                console.log("成功获取到数据...")
                console.log(res)
                that.setData({
                    dishesObjects: res.data,
                    loading: false
                });
            },
            fail: function (e) {
                console.log(e, "没有找到，从配置中加载默认数据")
                //没有找到，从配置中加载默认数据
                wx.setStorage({
                    key: "dishesObjects",
                    data: config.dishesObjects,
                    success: function (res) {
                        console.log("存储成功，重新读取...");
                        that.getDishesObjects();
                    },
                    fail: function () {
                        console.log("存储失败，提示用户...");
                    }
                })
            }
        })
    },
    recordData(dishName) {
        wx.getStorage({
            key: 'confirmDishes',
            success: function (res) {
                console.log(res)
                if (res.data[dishName]) {
                    res.data[dishName] += 1
                } else {
                    res.data[dishName] = 1
                }
                wx.setStorage({
                    key: "confirmDishes",
                    data: res.data
                })
            },
            fail: function (e) {
                var obj = new Object();
                obj[dishName] = 1;
                wx.setStorage({
                    key: "confirmDishes",
                    data: obj
                })
            }
        })
    },
    onShow: function () {
        this.getDishesObjects()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

        return {
            title: '不知道吃什么？进来选',
            path: '/pages/takeout/takeout',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    checkUpdate() {
    },
    bindGetUserInfo: function (e) {
        console.log(e.detail.userInfo)
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
}))

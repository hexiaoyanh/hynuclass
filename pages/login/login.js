// pages/JW/JW.js

var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: "",
        password: "",
        switchValue: false, //保存选择按钮值
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.getStorage({
            key: 'Jwusername',
            success: function (res) {
                that.setData({
                    username: res.data
                })
            },
        });
        wx.getStorage({
            key: 'Jwpassword',
            success: function (res) {
                that.setData({
                    password: res.data
                })
            },
        });
        wx.getStorage({
            key: 'Jwnanyue',
            success: function (res) {
                that.setData({
                    switchValue: res.data
                })
            },
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    //开关变更函数
    switchChange: function (e) {
        this.setData({
            switchValue: e.detail.value
        })
        app.http.Nanyue = e.detail.value;
        wx.setStorage({
            key: 'Jwnanyue',
            data: e.detail.value,
        })
    },
    login: function (e) {
        var that = this;
        wx.showLoading({
            title: '加载中',
        })
        var objData = e.detail.value;
        var that = this;
        if (objData.username && objData.password) {
            that.setData({
                btn_loading: !that.data.btn_loading
            })
            wx.setStorage({
                key: 'Jwusername',
                data: objData.username,
            });
            wx.setStorage({
                key: 'Jwpassword',
                data: objData.password,
            });
            wx.setStorage({
                key: 'Jwnanyue',
                data: that.data.switchValue,
            })
            wx.request({
                url: 'https://www.hynuxyk.club/query/login',
                method: "POST",
                data: {
                    "username": objData.username,
                    "password": objData.password,
                    "nanyue": that.data.switchValue
                },
                success(res) {
                    wx.hideLoading();
                    console.log(res.data);
                    if (res.data.Msg != "OK")
                        wx.showModal({
                            content: res.data.Msg
                        })
                    wx.showLoading({
                        title: '正在获取课表',
                    });
                    that.Getkb(res.data.cookie['JSESSIONID'], that.data.switchValue);
                },
                fail(res) {
                    console.log(res.data);
                }
            })

        } else {
            wx.hideLoading();
            wx.showModal({
                title: '错误',
                content: '请输入学号或密码',
            })
        }
    },
    Getkb: function (cookies, nanyue) {
        var date = new Date();
        var year = Number(date.getFullYear().toString());
        var month = Number(date.getMonth() + 1)
        var str = null;
        if (month <= 1 || month >= 8) {
            str = (year - 1).toString() + '-' + year.toString() + '-1';
        } else {
            str = (year - 1).toString() + '-' + year.toString() + '-2';
        }
        console.log(cookies, nanyue);
        let num=0;
        for (let i = 0; i <= 25; ++i)
            wx.request({
                url: 'https://www.hynuxyk.club/query/kb',
                method: 'POST',
                data: {
                    "cookies": cookies,
                    "date": str,
                    "week": i,
                    "nanyue": nanyue
                },
                success(res) {
                    console.log(i,res.data);
                    num++;
                    wx.setStorage({
                      data: res.data.kb,
                      key:"week"+i.toString(),
                    });
                    if(num==24){ 
                        wx.hideLoading();
                        wx.setStorage({
                          data: true,
                          key: 'islogin',
                        })
                        wx.redirectTo({
                          url: '../class/class?islogin=true',
                        })
                    }
                },
                fail(res) {
                    console.log(res);
                }
            })
    }

})
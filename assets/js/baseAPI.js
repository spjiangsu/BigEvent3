//开发环境地址
var baseUrl = "http://ajax.frontend.itheima.net"
    //测试环境地址
    // var baseUrl = "http://ajax.frontend.itheima.net"
    //生产环境地址
    // var baseUrl = "http://ajax.frontend.itheima.net"



//请求头
$.ajaxPrefilter(function(options) {
    options.url = baseUrl + options.url
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }

    //登录拦截
    options.complete=function(res){   
     var obj=res.responseJSON;
     if (obj.status==1&&obj.message==="身份认证失败！"){
         localStorage.removeItem('token')
         location.href="/login.html"
     }
    }
})
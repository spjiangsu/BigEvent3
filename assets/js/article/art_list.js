$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 时间过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        var y = dt.getFullYear()
        var m = padzero(dt.getMonth() + 1)
        var d = padzero(dt.getDate())
        var hh = padzero(dt.getHours())
        var mm = padzero(dt.getMinutes())
        var ss = padzero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    function padzero(n) {
        return n > 9 ? n : '0' + n
    }



    //定义提交参数
    var q = {
        pagenum: 1,	    //页码值
        pagesize: 2,	//每页显示多少条数据
        cate_id: "",    //文章分类的 Id
        state: "",	    //文章的状态，可选值有：已发布、草稿
    }

    //初始化表格
    initTable()
    initCate()
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    $('#form-serach').on('submit', function (e) {
        e.preventDefault()
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        initTable()
    })

    function renderPage(num) {
        // alert(num)
        laypage.render({
            elem: 'pageBox', //注意，这里的 ID，不用加 # 号
            count:num, //数据总数，从服务端得到
            limit:q.pagesize,
            curr:q.pagenum,
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagesize=obj.limit
                //首次不执行
                if(!first){
                  //do something
                  q.pagenum=obj.curr
                  initTable()
                }
              }
          });
    }
    $('body').on('click','.btn-del',function(){
        var id=$(this).data('id')
        var len=$('.btn-del').length
        // console.log(len);
        // console.log(id);
        layer.confirm('确认删除?', {icon:3,title:'提示'},function(index){
            $.ajax({
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    if(len===1){
                        q.pagenum===1?q.pagenum=1:q.pagenum=q.pagenum-1;
                    }
                    initTable()
                }
                
            })
            
            layer.close(index);
          });       
    })
})


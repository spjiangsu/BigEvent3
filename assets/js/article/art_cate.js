$(function () {
    //-----------------------初始化渲染页面-----------------------------------------
    initAriticleList()
    function initAriticleList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // console.log(res.data);
                var str = template('tpl-table', res)
                $('tbody').html(str)
            }
        })
    }

//------------------------------添加功能---------------------------------------------
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({//打开一个弹出层
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });

    })
    var indexAdd = null
    $('body').on('submit', '#addCate', function (e) {
        e.preventDefault()
        // console.log('ok');

        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initAriticleList()
                layer.msg(res.message)
                layer.close(indexAdd)
            }
        })
    })
    // ----------------------------------编辑功能-----------------------------------------
    var indexEdit = null
    $('body').on('click', '#form-edit', function () {
        // console.log('ok');
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var Id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // layer.msg(res.message)
                layui.form.val('editCate', res.data)
            }
        })



    })

    $('body').on('submit', '#editCate', function (e) {
        e.preventDefault()
        console.log('ok');
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $('#editCate').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // console.log(res.data);
                initAriticleList()
                layer.close(indexEdit)
            }
        })
    })

    // -------------------------------删除功能------------------------------------
    $('body').on('click', '#del-cate', function () {
        var Id = $(this).attr('data-id')
        layer.confirm('确认删除此项吗?', {icon: 3, title:'提示'}, function(index){ 
            $.ajax({
                url: '/my/article/deletecate/'+ Id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initAriticleList()
                }
            })
            layer.close(index);
          });
    })
})

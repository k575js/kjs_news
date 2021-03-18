$(() => {
    // 需求0 导航栏菜单
    getData('/index/category', 'level_two', '.level_two')
    getData('/index/category', 'level_two', '.left_menu')

    // 需求1 热门排行
    getData('/index/rank', 'hotrank_list', '.hotrank_list');

    // 需求2 最新评论
    getData('/index/latest_comment', 'comment_list', '.comment_list');

    // 需求3 焦点关注
    getData('/index/attention', 'guanzhu_list', '.guanzhu_list');



    // 需求4 文章内容
    // 1.通过url地址拿到id 发送ajax请求
    console.log(location.search.split('=')[1]);
    const id = location.search.split('=')[1]
    $.ajax({
        url: 'http://120.24.171.137:1337/api/v1/index/article',
        type: 'get',
        data: { id },
        success: (res) => {
            console.log(res);
            if (res.code != 200) return layui.layer.msg(res.msg)
            $('#cate').html(res.data.category).attr('href', `/list.html?id=${res.data.categoryId}`)
            $('.article_content').html(template('article_content', { data: res.data }));

        }
    })



    // 需求5 评论列表
    $.ajax({
        url: 'http://120.24.171.137:1337/api/v1/index/get_comment',
        type: 'get',
        dataType: 'json',
        data: {
            articleId: id
        },
        success: function (backData) {
            // console.log(backData);
            $('.comment_list_con').html(template('comment', backData));
            //根据数组长度显示评论条数
            $('.comment_count').text(backData.data.length + '条评论');
        }
    });

    // 需求6 发表评论按钮点击事件
    //表单按钮：禁用默认事件
    $('.comment_sub').click(function (e) {
        //1.禁用默认行为
        e.preventDefault();
        //2.非空判断
        if ($('.comment_name').val().trim().length == 0 || $('.comment_input').val().trim().length == 0) {
            layui.layer.msg('请输入用户名和评论内容');
            return;
        };
        //3.ajax请求
        $.ajax({
            url: 'http://120.24.171.137:1337/api/v1/index/post_comment',
            type: 'post',
            dataType: 'json',
            data: {
                author: $('.comment_name').val(),
                content: $('.comment_input').val(),
                articleId: id
            },
            success: function (backData) {
                console.log(backData);
                if (backData.code == 201) {
                    layui.layer.msg('发表成功');
                    window.location.reload();
                }
            }
        });
    });




    // 需求7 搜索功能
    $('.search_btn').on('click', () => {
        let val = $(".search_txt").val().trim();
        if (!val) return layui.layer.msg('内容不能为空');
        location.href = `/list.html?key=${val} `;
    })
    $('.search_txt').on('keydown', (e) => {
        if (e.keyCode == 13) $('.search_btn').click();
    })









    // 封装方法
    function getData(url, templateId, parent) {
        $.ajax({
            url: `http://120.24.171.137:1337/api/v1${url}`,
            type: 'get',
            success: (res) => {
                if (res.code != 200) return layui.layer.msg(res.msg)
                $(`${parent}`).html(template(templateId, { list: res.data }))
            }
        })
    }

})
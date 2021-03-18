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


    const id = location.search.split('=')[0].indexOf('id') == 1 ? location.search.split('=')[1] : '';

    // key: "",   //搜索关键词，可以为空，为空返回某类型所有文章
    // type: '',  //文章类型id，可以为空，为空返回所有类型文章
    // page: 1,  //当前页，为空返回第1页
    // perpage: 6 //每页显示条数，为空默认每页6条

    let p = {
        key: "",
        type: '',
        page: 1,
        perpage: '6'
    }

    // 需求4  文章列表
    initList();



    // 需求5 搜索功能
    $('.search_btn').on('click', () => {
        p.key = $(".search_txt").val().trim();
        if (!p.key) return layui.layer.msg('内容不能为空');
        initList()
    })
    $('.search_txt').on('keydown', (e) => {
        if (e.keyCode == 13) $('.search_btn').click();
    })



    //需求6 index.html页面搜索 跳转到list页面 进行search
    if (location.search.split('=')[0].indexOf('key') == 1) {
        console.log('jinlail ');
        p.key = decodeURI(location.search.split('=')[1])
        initList()
    }







    // 封装方法 发送 ajax请求 获取文章列表
    function initList() {
        p.type = id;
        $.ajax({
            url: `http://120.24.171.137:1337/api/v1/index/search`,
            type: 'get',
            data: p,
            success: (res) => {
                console.log(res);
                if (res.code != 200) return layui.layer.msg(res.msg);
                if (res.data.totalCount == 0 || res.data.data.length == 0) {
                    $('.search_txt').val('')
                    return layui.layer.msg('查无此内容');
                }
                $(`.setfr`).html(template('art_list', { list: res.data.data }))
                // 文章头部 类型
                $('.list_title').html(`<h3>${res.data.data[0].category}</h3>`)
                paging(res.data.totalCount) //分页  传入总文章数
            }
        })
    }



    // 封装一个分页方法
    function paging(sum) {
        // console.log(sum);
        console.log(Math.ceil(sum / p.perpage));
        $("#pagination").pagination({
            currentPage: p.page,   //当前页码
            totalPage: Math.ceil(sum / p.perpage),  //显示页数
            callback: function (current) {
                p.page = current;
                initList()
            }
        });
    }





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
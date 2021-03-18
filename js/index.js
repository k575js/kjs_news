$(() => {
    // 需求0 导航栏菜单
    getData('/index/category', 'level_two', '.level_two')
    getData('/index/category', 'level_two', '.left_menu')

    // 需求1  热门焦点图
    getData('/index/hotpic', 'focus_list', '.focus_list');
    // 需求2  最新资讯
    getData('/index/latest', 'common_news_list', '.common_news');
    // 需求3  热门排行
    getData('/index/rank', 'hotrank_list', '.hotrank_list');
    // 需求4  最新评论
    getData('/index/latest_comment', 'comment_list', '.comment_list');
    // 需求5  焦点关注
    getData('/index/attention', 'guanzhu_list', '.guanzhu_list');


    // 需求5 搜索功能
    $('.search_btn').on('click', () => {
        let val = $(".search_txt").val().trim();
        if (!val) return alert('内容不能为空');
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
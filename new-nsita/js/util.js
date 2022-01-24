/*
 * @Author: wanqqq29
 * @Date: 2022-01-21 11:23:37
 * @LastEditTime: 2022-01-24 15:31:39
 * @LastEditors: wanqqq29
 * @Description: blog.wanqqq29.cn
 * @FilePath: \1x3Daily-HTML\new-nsita\js\util.js
 */
change_title()
tab_change()
// 显示element i传值 把当前隐藏并显示下一个
function change(i) {
    $(".origin").children().eq(i).css("display", "none");
    $(".origin").children().eq(i + 1).css({
        "display": "block",
        "animation": "star 0.4s cubic-bezier(0.4, 0, 1, 1) "
    });
}

function change_title() {
    var i = -1;
    $(".origin").children().eq(0).css({
        "display": "block",
        "animation": "star 0.4s cubic-bezier(0.4, 0, 1, 1) "
    });
    setInterval(() => {
        change(i);
        i++;
        if (i == 4) { //判断当i==4（一次循环完毕后从-1开始继续循环）
            i = -1
        }
    }, 2000);
}

//跟随鼠标切换tab
// jquery事件 mouseenter(鼠标移入事件)
// 鼠标移入触发.tab('show')
function tab_change(){
    $('.nav_btn').mouseenter(function(event){
        $(this).tab('show')
    })
}
/*
 * @Author: wanqqq29
 * @Date: 2022-01-21 11:23:37
 * @LastEditTime: 2022-01-21 15:11:30
 * @LastEditors: wanqqq29
 * @Description: blog.wanqqq29.cn
 * @FilePath: \1x3Daily-HTML\new-nsita\js\util.js
 */
change_title()

// 显示element i传值 把当前隐藏并显示下一个
function change(i) {
    $(".origin").children().eq(i).css("display", "none");
    $(".origin").children().eq(i + 1).css("display", "block");
}

function change_title() {
    var i = -1;
    $(".origin").children().eq(0).css("display", "block");
    setInterval(() => {
        change(i);
        i++;
        if (i == 4) { //判断当i==4（一次循环完毕后从-1开始继续循环）
            i = -1
        }
    }, 1500);

}
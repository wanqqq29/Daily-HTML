// ==UserScript==
// @name         散户收寄
// @namespace    http://tampermonkey.net/
// @version      2024-12-2-1
// @description  优化第二版，待测试
// @author       wnqn
// @match        https://10.4.188.1/portal/a
// @icon         https://www.google.com/s2/favicons?sz=64&domain=188.1
// @updateURL    https://raw.githubusercontent.com/wanqqq29/Daily-HTML/refs/heads/master/shsj.js
// @downloadURL  https://raw.githubusercontent.com/wanqqq29/Daily-HTML/refs/heads/master/shsj.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';


    function getDom() {
        // 用特定的 URL 调用此函数
        const targetSrc = "https://10.4.188.1/pickup-web/a/postwaybill/main"; // 替换为你想要检测的 URL
        var iframe = checkIframeSrc(targetSrc);
        return iframe
    }

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.left = '10px';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid black';
    container.style.padding = '10px';
    container.style.zIndex = '10000';
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
    container.style.flexWrap = 'wrap';
    container.style.width = '200px';

    // 插入文本区域和进度显示
    const textareaDom = document.createElement('textarea');
    textareaDom.id = 'myTextarea';
    textareaDom.style.width = '300px';
    textareaDom.style.height = '150px';
    textareaDom.placeholder = '在这里输入以换行分隔的单号...';
    container.appendChild(textareaDom);

    const progressDiv = document.createElement('div');
    progressDiv.id = 'progress';
    progressDiv.style.marginTop = '10px';
    container.appendChild(progressDiv);


    // Create name input field
    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('placeholder', '姓名');
    container.appendChild(nameInput);

    // Create num input field
    const numInput = document.createElement('input');
    numInput.setAttribute('type', 'number');
    numInput.setAttribute('placeholder', '身份证号');
    container.appendChild(numInput);

    // Create 内件 input field
    const njInput = document.createElement('input');
    njInput.setAttribute('type', 'text');
    njInput.setAttribute('placeholder', '内件名');
    container.appendChild(njInput);

    // Create a button
    const button = document.createElement('button');
    button.innerText = 'Go';
    button.addEventListener('click', go);
    container.appendChild(button);

    // Add the container to the document body
    document.body.appendChild(container);

    function checkIframeSrc(targetSrc) {
        // 获取页面中所有的 iframe 元素
        const iframes = document.getElementsByTagName('iframe');
        console.log(iframes)

        // 遍历所有的 iframe 元素
        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];

            // 检查 iframe 的 src 属性是否为特定值
            if (iframe.src === targetSrc) {
                console.log(`找到匹配的 iframe:`, iframe);
                return iframe; // 找到匹配的 iframe 并返回
            }
        }

        console.log('没有找到匹配的 iframe');
        return null; // 如果没有找到匹配的 iframe，返回 null
    }


    //插入基本信息
    function insertBasicInfo() {
        const iframe = getDom()
        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        //填写身份信息
        iframeDocument.getElementById('senderLinker').value = nameInput.value
        iframeDocument.getElementById('senderIdEncryptedCode').value = nameInput.value
        iframeDocument.getElementById('senderIdNo').value = numInput.value
        console.log('插入身份信息')

    }
    function insertNeiJian() {
        const iframe = getDom()
        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        //插入内件
        iframeDocument.getElementById('cargoMaterials').click()
        iframeDocument.getElementById('contentsTypeNoss1').value = njInput.value
        iframeDocument.getElementById('addcargo').click()
        iframeDocument.querySelector("#cargoMaterial > div.modal-body > div:nth-child(6) > div > div.span2 > input").click()
        console.log('插入内件信息')
    }

    let items = [];
    let currentIndex = 0;

    // 更新进度显示
    function updateProgress() {
        currentIndex += 1
        progressDiv.textContent = `已完成：${currentIndex}/剩余:${items.length - currentIndex}`
    }

    //处理单号
    function getWaybillListFromTextArea() {
        console.log(textareaDom.value)
        items = textareaDom.value.split('\n').filter(item => item.trim() !== '');
        currentIndex = 0;
    }


    function insertWaybillNo(WaybillNo) {
        const iframe = getDom()
        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        iframeDocument.getElementById('waybillNo').value = WaybillNo
        console.log('插入订单')
        //添加内件
        const inputElement = iframeDocument.getElementById('receiverAddr')
        inputElement.value = ""
        console.log('置空地址')

    }

    function performTasks() {

        setTimeout(() => {
            insertBasicInfo()
        }, 200)

        setTimeout(() => {
            insertNeiJian();
        }, 500)

        //提交
        setTimeout(() => {
            submitWaybill()
        }, 800)

        setTimeout(() => {
            insertWaybillNo(items[currentIndex]);
        }, 1000)




    }

    let lastValue = ""; // 用于存储上一次的值
    let intervalId = null; // 用于保存定时器ID

    // Define the go function
    function go() {

        getWaybillListFromTextArea()//切割单号
        currentIndex = 0
        progressDiv.textContent = `已完成：${currentIndex}/剩余:${items.length - currentIndex}`
        console.log(currentIndex, items.length)
        insertWaybillNo(items[currentIndex]);

        const iframe = getDom()
        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        const inputElement = iframeDocument.getElementById('receiverAddr')

        //监听回车
        $(iframeDocument).ready(function () {
            iframeDocument.getElementById('waybillNo').addEventListener('keydown', function (event) {
                if (event.key === 'Enter') { // 使用 'key' 属性检测按键
                    //按回车后开始监听
                    lastValue = inputElement.value; // 初始化值
                    // 停止任何已有的监听，以防止多次启动
                    if (intervalId !== null) {
                        clearInterval(intervalId);
                    }
                    // 开始监听值的变化
                    intervalId = setInterval(() => {
                        if (inputElement.value !== lastValue) {
                            console.log(inputElement.value)
                            // 值改变了，执行main函数
                            performTasks();

                            // 停止监听
                            clearInterval(intervalId);
                            intervalId = null;
                        }
                    }, 100); // 每100毫秒检查一次
                }
            });
        })
    }
    function submitWaybill() {
        const iframe = getDom()
        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        iframeDocument.getElementById('smt').click()
        updateProgress()
        console.log('提交')
    }
    njInput.value = '鞋'
    nameInput.value = '吴凤旺'
    numInput.value = '371722200402193819'
    textareaDom.value = `1263526997316
1263526997316
1263526997316
`
})();

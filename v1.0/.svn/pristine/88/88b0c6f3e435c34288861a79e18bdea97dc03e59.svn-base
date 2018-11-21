
let tools = {}; // 里面用于包含一些公用的方法，以免重名

// 封装tools,添加一些公用方法
(() => {
    // 封装的ajax
    const ajax = (url, data='', method='GET') => {
        let xml = new XMLHttpRequest();

        xml.onreadystatechange = () => {
            return new Promise((resolve) => {
                if (xml.status === 4 && xml.readyState === 200) {
                    resolve(xml.responseText);
                }
            })
        };
        xml.open(method, url);
        xml.send(data);
    };

    // 设置消息配置messageSettings
    const setMessageSettings = (newOptions) => {
        let oldMessageSettings = JSON.parse(localStorage.getItem('messageSettings')) || [];

        for (let i = 0, len = oldMessageSettings.length; i < len; i++) {
            if (newOptions.systemCode === oldMessageSettings[i].systemCode) { // 修改之前的配置
                Object.assign(oldMessageSettings[i], newOptions);
                localStorage.setItem('messageSettings', JSON.stringify(oldMessageSettings)); // 再次存储

                return true;
            }
        }

        // 没有的话就新增配置
        oldMessageSettings.push(newOptions);
        localStorage.setItem('messageSettings', JSON.stringify(oldMessageSettings));
    };

    // 通过systemCode获取对应的消息设置的配置
    const getMessageSettings = (systemCode) => {
        let messageSettings = JSON.parse(localStorage.getItem('messageSettings')) || [];
        let res = {};

        messageSettings.forEach((item) => {
            if (item.systemCode === systemCode) {
                res = item;

                return true;
            }
        });

        return res;
    };

    // 根据系统编码来在本地查询对应的消息提示数据
    const queryMessagesBySystemCode = (systemCode) => {
        const messageTips = JSON.parse(localStorage.getItem('messageTips'));
        let res = [];

        if (messageTips.length < 1) return res;

        messageTips.forEach(item => {
            if (item.systemCode === systemCode) {
                res = item.messages;
            }
        });

        return res;
    };

    // 点击消息,从本地存储里面删除对应消息
    const deleteMessage = (systemCode, msgType) => {
        let messageTips = JSON.parse(localStorage.getItem('messageTips'));
        let count = 0;

        messageTips.forEach((item, outIndex) => {
            if (item.systemCode === systemCode) {
                item.messages.forEach((msg, index) => {
                    if (msg.msgType === msgType) {
                        item.messages.splice(index, 1);
                        item.allCount -= msg.count; // 总数也减去

                        if (item.allCount <= 0) { // 如果消息总数为零，直接删除
                            messageTips.splice(outIndex, 1);
                        }
                        count = item.allCount;
                    }
                });
            }
        });
        localStorage.setItem('messageTips', JSON.stringify(messageTips));

        return count;
    };

    // 把字符串里面的$count替换成 <em>12</em>的形式
    const replaceCount = (str, count) => {
        return str.replace('${count}', `<em>${count}</em>`);
    };

    // 自动播放语音
    const autoplayAudio = (audioUrl="audio/default.mp3") => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContext();
        const url = audioUrl;
        let source = null;
        let audioBuffer = null;

        function stopSound() {
            if (source) {
                source.noteOff(0); //立即停止
            }
        }

        function playSound() {
            source = context.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(context.destination);
            source.start(0); //立即播放
        }

        function initSound(arrayBuffer) {
            context.decodeAudioData(arrayBuffer, function(buffer) { //解码成功时的回调函数
                audioBuffer = buffer;
                playSound();
            }, function(e) { //解码出错时的回调函数
                console.log('Error decoding file', e);
            });
        }

        function loadAudioFile(url) {
            const xhr = new XMLHttpRequest(); //通过XHR下载音频文件
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function(e) { //下载完成
                initSound(this.response);
            };
            xhr.send();
        }

        loadAudioFile(url);
    };

    // 检测本地存储的messageTips和messageSettings是不是空，如果是，那么设置为空数组
    const testLocalData = () => {
        let messageTips = localStorage.getItem('messageTips');
        let messageSettings = localStorage.getItem('messageSettings');

        if (!messageTips) {
            localStorage.setItem('messageTips', JSON.stringify([]));
        }
        if (!messageSettings) {
            localStorage.setItem('messageSettings', JSON.stringify([]));
        }
    };

    // 判断设置是否是空数组，如果是，那么隐藏按钮组，不让操作; 反之，显示按钮组 now
    const controlButtonShow = () => {
        const messageSettings = JSON.parse(localStorage.getItem('messageSettings')); // now
        const ul = document.querySelector('.settings-wrap-lr .message-settings-right-lr ul');
        console.log(messageSettings)
        if (messageSettings.length === 0 && messageSettings instanceof Array) {
            ul.classList.add('hide');
            console.log('隐藏了')
        } else {
            console.log('显示了')
            ul.classList.remove('hide');
        }
    };

    // 统计消息总数
    const getTipsCount = () => {
        const redCount = document.getElementById('redCount');
        const messageTips = JSON.parse(localStorage.getItem('messageTips'));
        let count = 0;
        redCount.style.display = 'block';

        for (let i = 0, len = messageTips.length; i < len; i++) {
            count += parseInt(messageTips[i].allCount);
        }

        if (count > 999) {
            redCount.innerHTML = '999+';
        } else if (count <= 0) {
            redCount.style.display = 'none';
        } else {
            redCount.innerHTML = count;
        }
    };

    // 添加方法
    Object.assign(tools, {
        ajax,
        setMessageSettings,
        getMessageSettings,
        queryMessagesBySystemCode,
        replaceCount,
        deleteMessage,
        autoplayAudio,
        testLocalData,
        controlButtonShow,
        getTipsCount
    });
})();


// js初始化页面结构
(() => {
    // 生成消息中心和设置模块
    const headContainer = document.querySelector('.message-head-lr');

    // 把html添加进某个container里面
    const append = (selector, className, html) => {
        let div = document.createElement('div');
        div.className = className;
        div.innerHTML = html;
        const container = document.querySelector(selector);
        container.appendChild(div);
    };

    tools.testLocalData(); // 先检测一下本地有没有存储，没有的话设置为空数组

    // 构建消息设置左边列表的html
    const initSettingsList = () => {
        const messageSettings = JSON.parse(localStorage.getItem('messageSettings')) || [];
        const len = messageSettings.length;

        if (len > 0) {
            let html = `<li 
                                class="active"
                                data-systemName="${messageSettings[0].systemName}" 
                                data-systemCode="${messageSettings[0].systemCode}"
                                data-message="${messageSettings[0].message}"
                                data-quite="${messageSettings[0].quite}"
                            >
                                ${messageSettings[0].systemName}
                            </li>`;

            for (let i = 1; i < len; i++) {
                html += `<li
                                data-systemName="${messageSettings[i].systemName}"  
                                data-systemCode="${messageSettings[i].systemCode}"
                                data-message="${messageSettings[i].message}"
                                data-quite="${messageSettings[i].quite}"
                             >
                                ${messageSettings[i].systemName}
                             </li>`;
            }

            return html;
        }

        return '';
    };
    const settingsList = initSettingsList();

    // 构建消息设置右边按钮组列表html
    const initSettingsButton = () => {
        const messageSettings = JSON.parse(localStorage.getItem('messageSettings')) || [];

        const isActive = (flag) => { // 判断是否样式激活
            return flag ? 'active': '';
        };
        const defaultMessage = messageSettings[0] ? parseInt(messageSettings[0].message) : 1;
        const defaultQuite = messageSettings[0] ? parseInt(messageSettings[0].quite) : 0;
        const defaultSystemCode = messageSettings[0] ? messageSettings[0].systemCode: 'lronelove';

        let html = `
                <ul data-systemCode="${defaultSystemCode}">  
                    <li>
                        <input value="1" class="hide" type="text" name="message" id="message">
                        <span class="flag-lr">是否通知</span>
                        <span id="startMessage">
                            <span class="circle ${isActive(defaultMessage)}"></span>
                            <span>开启</span>
                        </span>
                        <span id="closeMessage">
                            <span class="circle ${isActive(!defaultMessage)}"></span>
                            <span>关闭</span>
                        </span>      
                    </li>
                    <li>
                        <input value="0" class="hide" type="text" name="message" id="quite"> 
                        <span class="flag-lr">是否静音</span>
                        <span id="startQuite">
                            <span class="circle ${isActive(defaultQuite)}"></span>
                            <span>开启</span>
                        </span>
                        <span id="closeQuite">
                            <span class="circle ${isActive(!defaultQuite)}"></span>
                            <span>关闭</span>
                        </span>
                    </li>
                </ul>                                        
            `;

        return html;
    };
    const settingsButton = initSettingsButton();

    // 计数部分html
    const numberCountHtml = (number) => {
        if (number > 0 && number) {
            return `<em>(${number})</em>`;
        } else {
            return '';
        }
    };

    // 构建消息提醒左边列表, messageTips是缓存在本地的所有tips数据
    const initTipsList = () => {
        const messageTips = JSON.parse(localStorage.getItem('messageTips'));
        let html = '';

        if (!messageTips || messageTips.length < 1) return ''; // 没有数据直接返回

        messageTips.forEach((item, index) => {
            if (index === 0) { // 默认第一个项目激活
                html += `<li 
                                class="active" 
                                data-systemCode="${item.systemCode}"
                                >
                                    ${item.systemName}${numberCountHtml(item.allCount)}
                             </li>`;
            } else {
                html += `<li 
                                data-systemCode="${item.systemCode}"
                                >
                                    ${item.systemName}${numberCountHtml(item.allCount)}
                             </li>`;
            }
        });

        return html;
    };
    const tipsList = initTipsList();

    // 构建消息提醒右边列表
    const initMessagesList = () => {
        const messageTips = JSON.parse(localStorage.getItem('messageTips')); // 所有tip数据

        if (!messageTips || messageTips.length < 1) return ''; // tips没有
        const tipsList = messageTips[0].messages; // 第一个tips数据

        if (tipsList.length < 1) return ''; // 还没有具体的消息字段
        let html = '';

        tipsList.forEach(item => {
            html += `<li 
                            class="oneline wordHidden" 
                            data-msgType="${item.msgType}" 
                            data-webReqUrl="${item.webReqUrl}"
                         >
                            ${tools.replaceCount(item.msgTypeDesc, item.count)}
                         </li>`;
        });

        return html;
    };
    const messagesList = initMessagesList();

    // 构建头部提示信息模块的html内容
    const headHtml = (settingsList, settingsButton, tipsList) => {
        let html = `
                <span></span>
                <div class="message-management-lr">
                        <!--这是消息设置及消息管理模块-->
                        <div class="message-settings">
                             <div class="message-settings-top-lr">
                                   <span class="iconfont icon-arrowleft hide"></span>
                                   <span class="words hide words-settings">消息设置</span>
                                   <span class="words words-tips">消息提醒</span>
                                   <span class="iconfont icon-setting"></span>
                             </div>
    
                             <!--下面是消息设置的模块-->
                             <div class="clear-fix settings-wrap-lr hide">
    
                                 <!--消息设置左边模块-->
                                <div class="message-settings-left-lr">
                                    <ul>
                                        ${settingsList}
                                    </ul>
                                 </div>
    
                                 <!--消息设置右边按钮组模块-->
                                 <div class="message-settings-right-lr">
                                      ${settingsButton}
                                  </div>
                             </div>
    
                             <!--下面是消息提醒的模块-->
                             <div class="clear-fix tips-wrap-lr">
    
                                 <!--消息提醒左边模块-->
                                <div class="message-settings-left-lr" id="message-tips-left-lr">
                                    <ul>
                                        ${tipsList}
                                    </ul>
                                 </div>
    
                                 <!--消息提醒右边分类列表模块-->
                                 <div class="message-settings-right-lr message-tips-right-lr">
                                       <ul>
                                           ${messagesList}
                                       </ul>
                                  </div>
                             </div>
                        </div>
                </div>
            `;

        return html;
    };

    // 初始化头部html内容
    append('.message-head-lr', 'message-management-triangle-lr hide', headHtml(settingsList, settingsButton, tipsList));

    // 生成弹出消息框外面的容器
    const initMessageBox = () => {
        const div = document.createElement('div');
        div.className = 'message-box-lr';
        document.body.appendChild(div);
    };

    initMessageBox(); // 生成弹出消息框外面的容器

    tools.controlButtonShow(); // 判断设置是否是空数组，如果是，那么隐藏按钮组，不让操作; 反之，显示按钮组

    tools.getTipsCount(); // 统计总的消息总数
})();

setTimeout(() => {
    // 点击导航栏的‘消息’按钮显示和隐藏
    (() => {
        const headMessageButton = document.querySelector('.message-head-button');
        const messageCenter = document.querySelector('.message-management-triangle-lr');
        const messageBox = document.querySelector('.message-management-lr');
        let isContainerShow = false; // 控制消息提醒容器显示与否

        const toggle = (e) => { // 显示与关闭消息提醒容器
            if (isContainerShow) {
                messageCenter.classList.add('hide');
            } else {
                messageCenter.classList.remove('hide');
            }
            isContainerShow = !isContainerShow;
            e.stopPropagation();
        };
        const hide = (e) => { // 关闭消息提醒容器
            if (isContainerShow) {
                messageCenter.classList.add('hide');
                isContainerShow = !isContainerShow;
            }
            e.stopPropagation();
        };

        headMessageButton.addEventListener('click', toggle);
        document.body.addEventListener('click', hide);
        messageBox.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止点击消息提醒容器，自身关闭
        });
    })();


    // 切换消息设置和提醒
    (() => {
        const settingsButton = document.querySelector('.message-settings-top-lr .icon-setting'); // 设置icon
        const backButton = document.querySelector('.message-settings-top-lr .icon-arrowleft'); // 返回icon
        const settingsContainer = document.querySelector('.settings-wrap-lr'); // 设置主容器
        const tipsContainer = document.querySelector('.tips-wrap-lr'); // 提醒主容器
        const settingWords = document.querySelector('.words-settings'); // 设置的标题
        const tipsWords = document.querySelector('.words-tips'); // 提醒的标题
        let isSettings = false; // 是否是消息设置页面

        // 切换消息设置和提醒
        const changeType = () => {
            if (isSettings) {
                settingsButton.classList.remove('hide');
                tipsContainer.classList.remove('hide');
                tipsWords.classList.remove('hide');
                settingWords.classList.add('hide');
                backButton.classList.add('hide');
                settingsContainer.classList.add('hide');
            } else {
                backButton.classList.remove('hide');
                settingsContainer.classList.remove('hide');
                settingWords.classList.remove('hide');
                tipsContainer.classList.add('hide');
                tipsWords.classList.add('hide');
                settingsButton.classList.add('hide');
            }
            isSettings = !isSettings;
        };
        settingsButton.addEventListener('click', changeType);
        backButton.addEventListener('click', changeType);
    })();


    // 消息提醒左侧点击切换样式
    (() => {
        const tipsListUl = document.querySelector('.tips-wrap-lr .message-settings-left-lr ul');

        // 根据本地存储对应系统的消息列表渲染消息
        const renderByMessagesList = (messagesList) => {
            let html = '';
            const ul = document.querySelector('.tips-wrap-lr .message-tips-right-lr ul');

            if (messagesList.length < 1 || !messagesList) {
                ul.innerHTML = html;
            } else {
                messagesList.forEach(item => {
                    html += `<li 
                                    class="oneline wordHidden"
                                    data-msgType="${item.msgType}" 
                                    data-webReqUrl="${item.webReqUrl}"
                                 >
                                    ${tools.replaceCount(item.msgTypeDesc, item.count)}
                                 </li>`;
                });
                ul.innerHTML = html;
            }
        };

        tipsListUl.addEventListener('click', (e) => {
            const target = e.target;
            let currentLi = null;

            if (target.tagName === 'LI') {
                currentLi = target;
            } else if (target.tagName === 'EM') { // 点击li标签里面的em标签
                currentLi = target.parentNode;
            }

            if (currentLi) { // 确实点击到了li标签上
                const activeDom = document.querySelector('.tips-wrap-lr .message-settings-left-lr li.active');
                if (activeDom) activeDom.classList.remove('active'); // 移除之前的激活的li标签样式
                currentLi.classList.add('active'); // 自身添加active样式
                const systemCode = currentLi.getAttribute('data-systemCode');
                const options = tools.queryMessagesBySystemCode(systemCode); // 查询当前系统的配置
                renderByMessagesList(options); // 渲染当前系统的消息
            }
        });
    })();


    // 消息提醒右侧列表点击事件
    (() => {
        const ul = document.querySelector('.tips-wrap-lr .message-tips-right-lr ul');

        ul.addEventListener('click', (e) => {
            let currentLi = null;
            let target = e.target;

            if (target.tagName === 'LI') {
                currentLi = target;
            } else if (target.tagName === 'EM') {
                currentLi = target.parentNode;
            }
            const webReqUrl = currentLi.getAttribute('data-webReqUrl');
            const msgType = currentLi.getAttribute('data-msgType');
            const systemDom = document.querySelector('.tips-wrap-lr #message-tips-left-lr li.active');
            const systemCode = systemDom.getAttribute('data-systemCode');

            currentLi.parentNode.removeChild(currentLi); // 移除点击的这个列表
            const count = tools.deleteMessage(systemCode, msgType); // 清空对应的消息记录
            tools.getTipsCount(); // 更新消息总数

            if (count > 0) {
                systemDom.querySelector('em').innerHTML = `(${count})`;
            } else {
                systemDom.parentNode.removeChild(systemDom);
            }
            window.open(webReqUrl);
        });
    })();


    // 消息设置交互操作
    (() => {
        const settingsUl = document.querySelector('.settings-wrap-lr .message-settings-left-lr ul');
        const startMessage = document.querySelector('#startMessage'); // 开启通知按钮
        const closeMessage = document.querySelector('#closeMessage'); // 关闭通知按钮
        const message = document.querySelector('#message'); // 通知的input
        const startQuite = document.querySelector('#startQuite'); // 开启静音按钮
        const closeQuite = document.querySelector('#closeQuite'); // 关闭静音按钮
        const quite = document.querySelector('#quite'); // 静音的input

        // 根据flag返回对应的类名
        const classNameByFlag = (flag) => {
            let className = flag? 'circle active': 'circle';

            return className;
        };

        // 根据 “1”，“0”，分别返回true和false
        const FlagByNum = (stringNum) => {
            const arr = {
                "1": true,
                "0": false
            };

            return arr[stringNum];
        };

        // 消息设置左侧点击切换
        settingsUl.addEventListener('click', (e) => {
            const target = e.target;
            let currentLi = null

            if (target.tagName === 'LI') {
                currentLi = target;
            } else if (target.tagName === 'EM') {
                currentLi = target.parentNode;
            }

            if (currentLi) { // 确实点击到li标签上面
                // 切换激活样式
                const activeDom = document.querySelector('.settings-wrap-lr .message-settings-left-lr li.active');
                if (activeDom) activeDom.classList.remove('active');
                currentLi.classList.add('active');

                // 切换系统设置
                const systemCode = currentLi.getAttribute('data-systemCode');
                const options = tools.getMessageSettings(systemCode); // 根据系统编码获取对应设置

                // 更改右边按钮组设置
                message.value = options.message;
                quite.value = options.quite;
                startMessage.querySelector('.circle').setAttribute('class', classNameByFlag(FlagByNum(options.message)));
                closeMessage.querySelector('.circle').setAttribute('class', classNameByFlag(!FlagByNum(options.message)));
                startQuite.querySelector('.circle').setAttribute('class', classNameByFlag(FlagByNum(options.quite)));
                closeQuite.querySelector('.circle').setAttribute('class', classNameByFlag(!FlagByNum(options.quite)));
                settingsUl.setAttribute('data-systemCode', systemCode);
            }
        });


        // 根据节点获取配置信息,并存储在本地
        const getOptionsFromDom = () => {
            let obj = {};
            obj.message = message.value;
            obj.quite = quite.value;
            const selectSystemDom = document.querySelector('.settings-wrap-lr .message-settings-left-lr .active');
            obj.systemCode = selectSystemDom.getAttribute('data-systemCode');
            obj.systemName = selectSystemDom.getAttribute('data-systemName');
            tools.setMessageSettings(obj);
        };

        // 切换
        const toggle = (startDom, closeDom, inputDom) => {

            startDom.addEventListener('click', () => {
                const classList = startDom.querySelector('span:first-child').classList;
                const flag = classList.contains('active'); // 判断是否已经是激活状态

                if (!flag) {
                    startDom.querySelector('span:first-child').classList.add('active');
                    inputDom.value = '1';
                    closeDom.querySelector('span:first-child').classList.remove('active');
                }
                getOptionsFromDom(); // 获取配置并存储在本地
            });

            closeDom.addEventListener('click', () => {
                const classList = closeDom.querySelector('span:first-child').classList;
                const flag = classList.contains('active'); // 判断是否已经是激活状态

                if (!flag) {
                    closeDom.querySelector('span:first-child').classList.add('active');
                    inputDom.value = '0';
                    startDom.querySelector('span:first-child').classList.remove('active');
                }
                getOptionsFromDom(); // 获取配置并存储在本地
            });
        };

        toggle(startMessage, closeMessage, message); // 切换是否通知开关
        toggle(startQuite, closeQuite, quite); // 切换静音开关
    })();


    // 提示消息盒子相关的js操作
    (() => {
        const messageBox = document.querySelector('.message-box-lr');

        // 点击删除message盒子
        const closeMessage = (messageBox) => {
            messageBox.addEventListener('click', (e) => {
                let target = e.target;
                let flag = true;

                if (target.classList.contains('message-item-close-lr')) {
                    let messageItem = target.parentNode.parentNode;
                    messageBox.removeChild(messageItem);
                    flag = false
                }
                e.stopPropagation();
                e.preventDefault();

                return flag;
            });
        };

        closeMessage(messageBox); // 设置点击关闭事件

        // 当有新的消息来的时候，获取对应的配置
        const systemSettings = (systemCode) => {
            const messageSettings = JSON.parse(localStorage.getItem('messageSettings'));
            let settings = { // 默认是不静音，加有消息提示
                quite: "0",
                message: "1"
            };

            if (!messageSettings || !messageSettings.length) return settings; // 默认是不静音的,有提示

            for (let i = 0, len = messageSettings.length; i < len; i++) {
                if (messageSettings[i].systemCode === systemCode) {
                    settings.quite = messageSettings[i].quite;
                    settings.message = messageSettings[i].message;

                    break ;
                }
            }

            return settings;
        };

        // 添加消息盒子
        const appendMessage = (messageBox, data, time) => {
            let a = document.createElement('a');
            let html = `
                    <div class="message-item-lr">
                        <span class="message-item-close-lr iconfont icon-close"></span>
                        <h3>${data.title}</h3>
                        <p class="wordHidden twoline">${data.content}</p>
                    </div>`;

            a.href = data.webReqUrl;
            a.className = 'message-item-wrap-lr';
            a.innerHTML = html;

            messageBox.appendChild(a); // 显示消息提示盒子
            setTimeout(() => { // 一段时间后移除
                if (a && a.parentNode) {
                    messageBox.removeChild(a);
                }
            }, time);
        };

        // socket，接受数据
        const socket = io('192.168.1.102:3001');

        // 显示通知文字和播放语音
        const showTips = (res) => {
            let messageOptions = {
                title: res.title,
                content: res.content,
                audio: res.audio,
                systemCode: res.systemCode
            };
            const settings = systemSettings(messageOptions.systemCode); // 获取系统对应配置

            if (settings.message === "1") { // 提示信息
                appendMessage(messageBox, messageOptions, 3000);
            }

            if (settings.quite === "0") { // 播放语音
                tools.autoplayAudio();
            }
        };

        // 更新本地的数据 now
        const updateLocalData= (res) => {
            const systemCode = res.systemCode;
            let messageTips = JSON.parse(localStorage.getItem('messageTips'));
            let messageSettings = JSON.parse(localStorage.getItem('messageSettings'));
            let hasExist = false; // 本地是否有存储该系统消息信息
            let hasContain = false; // 该系统内是否包含该种类消息

            for (let i = 0, len = messageTips.length; i < len; i++) {
                if (messageTips[i].systemCode === systemCode) {
                    hasExist = true;

                    // 当该系统有对应系统，且有该对应类型的消息, 增加count
                    plusMessageCount(i);

                    if (!hasContain && hasExist) { // 该系统没有该类消息，但是有该系统消息，直接添加
                        appendNewMsgType(res);
                    }
                    messageTips[i].allCount++; // 总数加1
                }
            }

            if (!hasExist) { // 本地之前没有存储该系统消息
                appendNewSystem(res);
                appendMessageSettings(res);
            }
            localStorage.setItem('messageTips', JSON.stringify(messageTips)); // 存储起来

            // 当有新的系统消息来的时候，添加新的设置信息
            function appendMessageSettings(res) {
                const settingsItem = {
                    "systemCode": res.systemCode,
                    "systemName": res.systemName,
                    "message": "1",
                    "quite": "0"
                };
                messageSettings.push(settingsItem);
                localStorage.setItem('messageSettings', JSON.stringify(messageSettings));
            }

            // 当该系统有对应系统，且有该对应类型的消息, 增加count
            function plusMessageCount(i) {
                for (let j = 0, length = messageTips[i].messages.length; j < length; j++) {
                    if (messageTips[i].messages[j].msgType === res.msgType) { // 该系统有该种类消息
                        messageTips[i].messages[j].count++;
                        hasContain = true;

                        break;
                    }
                }
            }

            // // 该系统没有该类消息，但是有该系统消息，添加新的消息类型
            function appendNewMsgType(res) {
                const messageItem = {
                    "msgTypeDesc": res.msgTypeDesc,
                    "msgType": res.msgType,
                    "count": 1,
                    "webReqUrl": res.webReqUrl
                };
                messageTips[i].messages.push(messageItem);
            }

            // 新系统消息来的时候，添加新系统相关配置
            function appendNewSystem(res) {
                const systemItem = {
                    "systemCode": res.systemCode,
                    "systemName": res.systemName,
                    "allCount": 1,
                    "messages": [
                        {
                            "msgTypeDesc": res.msgTypeDesc,
                            "msgType": res.msgType,
                            "count": 1,
                            "webReqUrl": res.webReqUrl
                        }
                    ]
                };
                messageTips.push(systemItem);
            }
        };


        // 更新本地的视图 now
        const updateViews = (res) => {
            const msgType = res.msgType;
            const systemUl = document.querySelector('#message-tips-left-lr ul'); // 消息提醒左侧ul
            let activeSystemNode = document.querySelector('#message-tips-left-lr li.active'); // 当前选中的系统节点
            const ul = document.querySelector('.message-tips-right-lr ul'); // 消息提醒的右边列表ul
            const systemNode = systemUl.querySelector(`#message-tips-left-lr [data-systemCode=${res.systemCode}]`); // 新消息对应的系统节点

            tools.getTipsCount(); // 统计总的消息总数

            if (!systemNode) { // 消息提醒左侧没有相应的节点,而且激活的节点存在
                appendSettingsNode(res); // 在消息设置左侧添加新的系统节点

                if (!activeSystemNode) { // 没有激活系统节点，也就是说没有系统节点（因为有的话基本就有激活样式）
                    appendMessageTipsNode(res, msgType); // 在消息提醒右侧，添加新的消息
                    appendSystemNode(true); // 在消息提醒左侧添加新的系统节点,状态激活
                    activeSystemNode = document.querySelector('#message-tips-left-lr li.active');
                } else {
                    appendSystemNode(false); // 在消息提醒左侧添加新的系统节点，状态未激活
                }

                return false;
            }

            const activeSystemCode = activeSystemNode.getAttribute('data-systemCode'); // 当前选中展示的系统编码
            const messagesList = tools.queryMessagesBySystemCode(activeSystemCode); // 该系统的消息列表信息
            const aLi = ul.querySelector(`[data-msgtype=${msgType}]`); // 对应消息种类的节点

            if (res.systemCode !== activeSystemCode) { // 接收到的消息的systemCode不是当前选中的节点
                addSystemCount(); // count加一

                return false; // 点击切换的时候，已经可以从本地获取了
            }

            updateSystemView(res); // 当本地有该系统消息的时候，所做的相关更新页面处理


            // 消息提醒右边，添加新的消息
            function appendMessageTipsNode(res, msgType) {
                let newLi = document.createElement('li');
                newLi.className = 'oneline wordHidden';
                newLi.setAttribute('data-msgType', msgType);
                newLi.setAttribute('data-webReqUrl', res.webReqUrl);
                newLi.innerHTML = tools.replaceCount(res.msgTypeDesc, 1);
                ul.appendChild(newLi);
            }

            // 添加消息设置节点
            function appendSettingsNode(res) {
                const ul = document.querySelector('.settings-wrap-lr .message-settings-left-lr ul');
                let li = document.createElement('li');

                li.setAttribute('data-systemName', res.systemName);
                li.setAttribute('data-systemCode', res.systemCode);
                li.setAttribute('data-message', '1'); // 新系统消息来，默认开启
                li.setAttribute('data-quite', '0'); // 默认是不静音的
                li.innerHTML = res.systemName;
                ul.appendChild(li);
            }

            // 计数非激活系统节点的count值
            function addSystemCount() {
                const em = systemNode.querySelector('em')
                let str = em.innerHTML;
                em.innerHTML = '(' + (parseInt(str.slice(1, str.length - 1)) + 1) + ')'; // 系统消息总数加1
            }

            // 当本地有该系统消息的时候，所做的相关更新页面处理
            function updateSystemView(res) {
                for (let i = 0, len = messagesList.length; i < len; i++) {
                    if (msgType === messagesList[i].msgType) { // 系统内有该类型消息，该表count数
                        if (aLi) {
                            let count = parseInt(aLi.querySelector('em').innerHTML); // 消息条数
                            count++;
                            aLi.innerHTML =  tools.replaceCount(res.msgTypeDesc, count);
                        } else { // 不存在该种类消息的节点
                            appendMessageTipsNode(res);
                            /*  let newLi = document.createElement('li');
                              newLi.className = 'oneline wordHidden';
                              newLi.setAttribute('data-msgType', msgType);
                              newLi.setAttribute('data-webReqUrl', res.webReqUrl);
                              newLi.innerHTML = tools.replaceCount(res.msgTypeDesc, 1);
                              ul.appendChild(newLi);*/
                        }
                        const em = activeSystemNode.querySelector('em')
                        let str = em.innerHTML;
                        em.innerHTML = '(' + (parseInt(str.slice(1, str.length - 1)) + 1) + ')'; // 系统消息总数加1
                    }
                }
            }

            // 在消息提醒左侧添加新的系统节点
            function appendSystemNode(isEmpty) {
                let li = document.createElement('li');
                li.innerHTML = res.systemName + `<em>(1)</em>`;
                li.setAttribute('data-systemCode', res.systemCode);

                if (isEmpty) {
                    li.className = 'active';
                }
                systemUl.appendChild(li); // 左侧列表添加一个节点
            }
        };

        // 通过socket接收到消息后的处理
        const messageHandler = (data) => {
            let res = JSON.parse(data);

            updateLocalData(res); // 更新本地存储的数据
            updateViews(res); // 更新视图
            showTips(res); // 展示弹出框和语音
            tools.controlButtonShow(); // 判断设置是否是空数组，如果是，那么隐藏按钮组，不让操作; 反之，显示按钮组
        };

        socket.on('connect', () => {
            console.log('connect');

            let userId = localStorage.getItem('aid');
            console.log(userId);
            socket.emit('join', userId);
            socket.on('message', (data) => {
                console.log('some message from web');
                messageHandler(data);
            });
        })
    })();
}, 500);


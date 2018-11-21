// 消息设置的本地存储, "1" 代表开启， "0"代表关闭
const messageSettings = [
    {
        "systemCode": "test1",
        "systemName": "test1",
        "message": "1",
        "quite": "0"
    },
    {
        "systemCode": "test2",
        "systemName": "test2",
        "message": "1",
        "quite": "0"
    },
    {
        "systemCode": "test3",
        "systemName": "test3",
        "message": "1",
        "quite": "0"
    }
];

// socket推送过来的数据格式
const socketData = {
    "title": "标题",
    "content": "内容",
    "systemCode": "test4",
    "systemName": "test4",
    "webReqUrl": "https://www.baidu.com",
    "msgType": "ready",
    "msgTypeDesc": "您有${count}一条工单消息，注意查收",
    "audio": "./audio/horse.ogg"
};

// 消息提醒存储在本地的数据
const messageTips = [
    {
        "systemCode": "test1",
        "systemName": "社区安防",
        "allCount": 12,
        "messages": [
            {
                "msgTypeDesc": "您有${count}条新的工单被加急，请及时处理",
                "msgType": "jack",
                "count": 10,
                "webReqUrl": "https://www.baidu.com"
            },
            {
                "msgTypeDesc": "您有${count}条新的工单被加急，请及时处理",
                "msgType": "rose",
                "count": 1,
                "webReqUrl": "https://www.baidu.com"
            },
            {
                "msgTypeDesc": "您有${count}条新的工单被加急，请及时处理",
                "msgType": "love",
                "count": 1,
                "webReqUrl": "https://www.baidu.com"
            }
        ]
    },
    {
        "systemCode": "test2",
        "systemName": "社区安防",
        "allCount": 12,
        "messages": [
            {
                "msgTypeDesc": "您有${count}条新的工单被加急，请及时处理",
                "msgType": "jack",
                "count": 1,
                "webReqUrl": "https://www.baidu.com"
            },
            {
                "msgTypeDesc": "您有${count}条新的工单被加急，请及时处理",
                "msgType": "rose",
                "count": 10,
                "webReqUrl": "https://www.baidu.com"
            },
            {
                "msgTypeDesc": "您有${count}条新的工单被加急，请及时处理",
                "msgType": "love",
                "count": 1,
                "webReqUrl": "https://www.baidu.com"
            }
        ]
    },
    {
        "systemCode": "test3",
        "systemName": "医院配送",
        "allCount": 12,
        "messages": [
            {
                "msgTypeDesc": "您有${count}条新的工单被加急，请及时处理",
                "msgType": "jack",
                "count": 4,
                "webReqUrl": "https://www.baidu.com"
            },
            {
                "msgTypeDesc": "您有${count}条新的工单被加急，请及时处理",
                "msgType": "rose",
                "count": 4,
                "webReqUrl": "https://www.baidu.com"
            },
            {
                "msgTypeDesc": "您有${count}条新的工单被加急，请及时处理",
                "msgType": "love",
                "count": 4,
                "webReqUrl": "https://www.baidu.com"
            }
        ]
    }
];
localStorage.setItem('messageTips', JSON.stringify(messageTips))
localStorage.setItem('messageSettings', JSON.stringify(messageSettings))





## task

### 下个版本
  添加可选必选

### 使用流程
配置一个api.json，引入该json

#### 构建http请求，检测交互数据 
```JavaScript
{
  "ip":"127.0.0.1",
  "port":"3000",
  "scene": "back-end",
  "api":[
    {
      "path":"/login",
      "method":"POST",
      "request":{
        "paswword":{
          "value":"tq6614118"
        },
        "userName":{
          "value":"takeern"
        }
      },
      "response": {
        "isSucceed": {
          "value": false,
          "type": "Boolean"
        }
      }
    },
    {
      "path":"/register",
      "method":"GET",
      "request":{
        "user":{
          "value":"tq6614118"
        }
      },
      "response":{
        "isSucceed":{
          "value":false,
          "type":"Boolean"
        }
      }
    }
  ]
}

#### 搭建后端，检测交互数据
```JavaScript
{
  "SPA-path":"/hello.html",
  "port": "3000",
  "scene": "front-end",
  "api":[
    {
      "path":"/login",
      "method":"POST",
      "request":{
        "paswword":{
          "value":"tq6614118",
          "type":"string"
        },
        "userName":{
          "value":"takeern",
          "type":"string"
        }
      },
      "response":{
        "isSucceed":false
      }
    },
    {
      "path":"/register",
      "method":"GET",
      "request":{
        "user":{
          "value":"tq6614118",
          "type":"string"
        }
      },
      "response":{
        "isSucceed":false
      }
    }
  ]
}
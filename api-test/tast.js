function run(jsonPath){
    const fetch = require('node-fetch');
    const fs=require('fs');
    const path=require('path');
    const bodyParser = require('koa-bodyparser');

//初始化web服务器
    const Koa=require('koa');
    const app=new Koa();
    const Router=require('koa-router');
    app.use(bodyParser());

//读取json参数
    const file=jsonPath;
    console.log('begin fetch json！');
    const result=JSON.parse( fs.readFileSync(path.join(__dirname,file)));
    if(result){
        console.log('fetch json succeed!');
    }
    if(!result.api){
        console.log('fetch json fail reason ：api is not undefined!');
        return ;
    }

    let api;
    if(result.scene==='back-end'){
        api={
            api:result.api,
            domain:result.ip+":"+result.port,
        };
        backEnd();
    }else {
        api={
            port:result.port||'3000',
            api:result.api,
            spaPath:result["SPA-path"]
        };
        frontEnd();
    }

    //to front
    function frontEnd(){
        function checkRequest(req,expectReq,path){
            if(req&&expectReq){
                if(!Object.is(expectReq,req)){
                    console.log('request-fail:request unexpect!');
                }else {
                    console.log('requets-succeed!');
                }
                const key=Object.keys(expectReq);
                for(let i of key){
                    if(!{}.toString.call(expectReq[key[i]])  ===  expectReq[i].type) {
                        console.log(`request-fail:port :${path} ${key[i]} type unexpect!`);
                    }
                }
            }else if(!req&&expectReq){
                console.log('request fail:request is undefiend!');
            }

        }



        const allRouter=[];
        for(let i=0;i<api.api.length;i++){
            let route=new Router();
            if(api.api[i].method==='POST'){
                route.post(api.api[i].path,async (ctx)=> {
                    let reqData = ctx.request.body;//存储请求值
                    checkRequest(reqData,api.api[i].request,api.api[i].path);
                    ctx.body=JSON.stringify(api.api[i].response);
                });
            }else{
                route.get(api.api[i].path,async (ctx)=>{
                    let reqData=ctx.query;
                    checkRequest(reqData,api.api[i].request,api.api[i].path);
                    ctx.body=JSON.stringify(api.api[i].response);
                })
            }
            allRouter.push(route);
        }




        let router = new Router();
//挂载子路由
        for(let i=0;i<allRouter.length;i++){
            router.use('', allRouter[i].routes(), allRouter[i].allowedMethods())
        }

        let home=new Router();

        home.get('/',async (ctx)=>{
            const readStream = fs.createReadStream(path.join(__dirname,api["spaPath"]));
            ctx.type = 'html';
            ctx.body=readStream;
        });


//挂载子路由
        router.use('', home.routes(), home.allowedMethods());

// 加载路由中间件
        app.use(router.routes()).use(router.allowedMethods());
        app.listen(parseFloat(api.port));
    }


    //to back
    function checkResponse(res,expectRes,path){
        let command=true;
        if(!res){
            console.log('respone-fail:response undefined!');
            return false;
        }else {
            if(Object.is(res,expectRes)){
                console.log('check succeed!');
            }else{
                for(let i in expectRes){
                    if(expectRes[i].type&&{}.toString.call(res[i]).search(expectRes[i].type)===-1){
                        console.log(`path ${path} :${i} type is wrong!`);
                        command=false;
                    }
                    if(expectRes[i].value!=res[i]){
                        console.log(`path ${path}:${i} value is wrong!`);
                        command=false;
                    }
                }
            }
        }
        return command;
    }
    function backEnd(){
        for(let i=0;i<1;i++){
            i=0;
            let {method,header,request,response,path}=api.api[i];
            if(method==='POST'){
                let reqData={};
                for(let m in request){
                    reqData[m]=request[m].value;
                }
                fetch(`http://${api.domain}${path}`,{method:'POST',header:header})
                    .then(res =>res.json())
                    .then((body)=>{
                        if(checkResponse(body,response,path)){
                            console.log('Congratulations no eeror!');
                        }
                    })
                    .catch(e =>console.log(e.message))
            }else{
                let reqData;
                for (let m in request){
                    reqData+=`${m}=${request[m].value}&`
                }
                console.log(reqData)
                fetch(`http://${api.domain}${path}?${reqData}`,{method:'GET',header:header})
            }
        }
    }
}

module.exports=run;


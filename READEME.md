### 카카오톡 자동응답 API + 파파고 API 2번째 ! 중국어 번역기 챗봇 만들기 

이번에는 여행사에서 일하는 지인의 부탁을 받고 중국어 번역기를 만들어 보겠습니다 ! 



#### 사용 Node 패키지

```
$ npm init -y
$ npm install request
$ npm install body-parser
$ npm install express
```



#### 플러스 친구 시작 시 text 타입으로 시작

````javascript
// 플러스친구 시작 시 text로 시작
app.get('/keyobard', function(req, res){
  const keyboard = {
    "type": "text"
  };
  
  res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify(keyboard));
});
````


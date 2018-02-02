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



#### 카카오톡 메세지 처리

```javascript
// 카카오톡 메세지 처리
app.post('/message', function(req, res){
  const _obj = {
    user_key: req.body.user_key,
    type: req.body.type,
    content: req.body.content
  }
  // 카톡으로 받은 텍스트 확인
  console.log(_obj);
  
  // 사용자 텍스트 한글 구분
  // 정규식표현
  var check = _obj.content;
  var languageCheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  
  // 사용자 입력 텍스트가 한글일 시
  if(languageCheck.test(check)){
    // 파파고에 전송할 데이터 만들기
    var options = {
      url: api_url,
      //한국어 -> 중국어, 카톡으로 받은 메세지 text
      form: {'source': 'ko', 'target': 'zh-CN', 'text': _obj.content},
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_password}
    };
    console.log(options);
    translatepost(options);
  }
  // 사용자 입력 텍스트가 한글이 아닐 시
  else {
    var options = {
      url: api_url,
      //중국어 -> 한국어, 카톡으로 받은 메세지 text
      form: {'source': 'zh-CN', 'target': 'ko', 'text':_obj.content},
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_password}
    };
    translatepost(options);    
  }
```


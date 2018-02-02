// 네이버 패키지 웹 요청
var key = require('./config.js');
var request = require('request');

// 카카오톡 파싱
var bodyParser = require('body-parser');

// 웹 패키지
var express = require('express');
var app = express();

// 파파고 NMT API KEY
var client_id = key.NAV_ID;
var client_password = key.NAV_PASSWORD;
// 파파고 NMT 요청 URL
var api_url = 'https://openapi.naver.com/v1/language/translate';

//application/json parse
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extend: true }));

// 플러스친구 시작 시 text로 시작
app.get('/keyboard', function(req, res){
  const keyboard = {
    "type": "text"
  };
  
  res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify(keyboard));
});

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
  
  function translatepost(options){
    // 파파고 번역기 사용을 위한 전송(post)
    console.log("test");
    
    request.post(options, function (error, response, body){
      //번역이 성공 시
      if(!error && response.statusCode == 200){
        //json 파싱
        var objBody = JSON.parse(response.body);
        //번역된 메세지
        console.log(objBody.message.result.translatedText);

        //카톡으로 번역된 메세지를 전송하기 위한 메세지
        let message = {
          "message": {
            "text": objBody.message.result.translatedText
          },
        };
      
        //카톡에 메세지 전송
        res.set({
          'content-type': 'application/json'
        }).send(JSON.stringify(message));
      }
      else {
        //네이버에서 메세지 에러 발생
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);

        let message = {
          "message": {
            "text": response.statusCode
          },
        };

        //카톡에 메세지 전송 에러 메세지
        res.set({
          'content-type': 'application/json'
        }).send(JSON.stringify(message));
      }
    });
  };
});

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  console.log("3000포트에서 열었음.");
});

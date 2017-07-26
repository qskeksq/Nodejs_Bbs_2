var dao = require("../c_dao/bbsDao");
var error = require("../error");
var querystring = require("querystring");

exports.read = function(qs, response){
    if(qs == ""){
        dao.select(function(data){ // dao를 통해 db를 읽고난 후 결과셋을 처리하는 코드
            var jsonString = JSON.stringify(data);
            send(response, jsonString);
        });
    }else{ // 검색을 위한 쿼리스트링이 있으면 쿼리스트링을 분해해서 처리한다.
        var parsedQs = querystring.parse(qs, '&', '=');
        // parsedQs = {
        //     title : "제목",
        //     author : "홍길동"
        // }
        dao.search(parsedQs, function(data){
            var jsonString = JSON.stringify(data);
            send(response, jsonString);
        });
    }
}
exports.write = function(request, response){
    console.log("in bbs write");
    // 데이터를 꺼내자
    var postdata = "";
    request.on('data', function(data){ // 데이터를 읽을 수 있을 때 호출
        postdata = postdata + data;
    });
    request.on('end', function(){ // 데이터를 다 읽었을 때 호출
        var dataObj = JSON.parse(postdata);
        dao.insert(dataObj, function(){
            send(response, '{"result":"ok"}');
        });
    });
}
// 업데이터는 write와 동작방식이 유사하다
exports.update = function(request, response){
    // 요청한 데이터를 담을 변수를 선언
    var postdata = "";
    request.on('data', function(data){ // 데이터가 버퍼에 가득차면 자동으로 호출
        postdata = postdata + data;
    });
    request.on('end', function(){ // 데이터를 다 읽었을 때 호출
        var dataObj = JSON.parse(postdata);
        dao.update(dataObj, function(err){
            if(err){
                error.send(response, 500, err);
            }else{
                send(response, '{"result":"ok"}');
            }
        });
    });
}
exports.delete = function(request, response){
    // 요청한 데이터를 담을 변수를 선언
    var postdata = "";
    request.on('data', function(data){ // 데이터가 버퍼에 가득차면 자동으로 호출
        postdata = postdata + data;
    });
    request.on('end', function(){ // 데이터를 다 읽었을 때 호출
        var dataObj = JSON.parse(postdata);
        dao.delete(dataObj, function(err){
            if(err){
                error.send(response, 500, err);
            }else{
                send(response, '{"result":"ok"}');
            }
        });
    });
}

function send(response, result){
    response.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
    response.end(result);
}
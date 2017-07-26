var database = require("../module/database");
var tableName = "board";

exports.select = function(callback){
    var query = "select * from "+tableName+" order by id desc"; // asc, desc 으로 처리해 줄 수 있다. 어센딩, 디센딩
    database.executeQuery(query, callback);
}

exports.search = function(qs, callback){
    var query = "select * from "+tableName+" where title like ? ";   // 여기도 qs.title 을 '%?%' 로 해주고 values 에 [qs.title] 해 줄 수 있다. ? 을 쓸 경우 특수문자 처리를 제대로 해 줄 수 있다
    var values = ["%"+qs.title+"%"];
    console.log(values);
    database.executeQueryValue(query, values, callback);
}

exports.insert = function(data, callback){
    console.log("in bbsDao insert");
    var query = " insert into "+tableName+"(title,content,author,date)";
        query = query + " VALUES ?";                        //  참고로 이렇게 넣어주면 3차원 배열로 인식해서 [[]] 두 번 더 괄호 넣어주는 것이고, values (?,?,?,?)로 하고 [[]] 없애줘도 된다.
    var values = [data.title,data.content,data.author,data.date];
    database.executeMulti(query, values, callback);
}

exports.update = function(data, callback){
    var query =   " update " + tableName
                + " set title   =? , "
                + "     content =? , "
                + "     author  =? , "
                + "     date    =?   "
                + " where id=?";
    var now = new Date().toLocaleDateString();
    var values = [data.title, data.content, data.author, now, data.id];
    database.execute(query, values, function(error){
        callback(error);
    });
}

exports.delete = function(data, callback){
    var query = "delete from "+tableName+" where id = ?";
    var values = [data.id];
    database.execute(query, values, function(error){
        callback(error);
    });
}
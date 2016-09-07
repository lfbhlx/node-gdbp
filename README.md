# node-gdbp
A universal Database Connection Pool for nodejs
## Why use gdbp?
Although the nodejs is single thread , you can use database pool to do mutile query together , and you can get a connection right now rather than create a connection when you use database pool.GDBP is a generic pool , you can use it to build pool for any database.
## How to use gdbp?
First , you must require this module. Then you can create a database pool like this(an example with mysql):\<br>
```javascript
var GDBPool = require('./lib/gdbp');
var dbpool = new GDBPool(function(){
	return mysql.createConnection({
		'host':'127.0.0.1',
		'user':'root',
		'password':'123456',
		'database':'hi',
		'insecureAuth':true
	});
},function(conn,callback){
	conn.end(function(){
		callback();
	});
});
```
the first argument is "how to create connection" , the others is "how to delete a connection"\<br>
Then you can use the "get" function to gain a connection object which constructor is : \<br>
```javascript
function Connection(conn)
{
	this.connection = conn;
	this.deadline = new Date(new Date().getTime() + overtime).getTime();
	this.id = new Date().getTime()+randomString(6);
}
```
You only neet access its "connection" field to get the original connection.\<br>
Finally you can do query with connection.

##APIs
###get()
To gain a Connection Object.
###ret(connObj)
return a Connection Object to Pool.



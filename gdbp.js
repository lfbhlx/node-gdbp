/**
 * http://usejsdoc.org/
 */
var overtime = 1500 * 1000;
var interval = 60 * 1000;

function randomString(len)
{
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var maxPos = $chars.length;
	var pwd = '';
	for(var i = 0; i < len; i++){
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

function Connection(conn)
{
	this.connection = conn;
	this.deadline = new Date(new Date().getTime() + overtime).getTime();
	this.id = new Date().getTime()+randomString(6);
}

function GDBPool(createConnection,closeConnection,initCount,maxCount,stepCount)
{
	var that = this;
	this.connections = {};
	this.usedconnections = {};
	this.createConnection = createConnection;
	this.closeConnection = closeConnection;
	this.initCount = initCount?initCount:10;
	this.maxCount = maxCount?maxCount:50;
	this.stepCount = stepCount?stepCount:5;
	this.leaveNumber = initCount?initCount:10;
	this.get = function(){
		if(that.leaveNumber < that.stepCount){
			setTimeout(function(){
				for(var i=0;i<that.stepCount;i++)
				{
					if(that.leaveNumber < that.maxCount){
						var conn = new Connection(that.createConnection());
						that.connections[conn.id] = conn;
						that.leaveNumber++;
					}else{
						break;
					}
				}
			},2);
		}
		that.leaveNumber--;
		var connObj = null;
		for(var id in that.connections)
		{
			connObj = that.connections[id];
			if(connObj) {
				break;
			}
		}
		if(connObj){
			that.connections[connObj.id] = null;
			that.usedconnections[connObj.id] = connObj;
		}else{
			throw 'dbpool is empty';
		}
		return connObj;
	};
	this.ret = function(connObj){
		that.connections[connObj.id] = connObj;
		that.usedconnections[connObj.id] = null;
		that.leaveNumber++;
	};
	for(var i=0;i<this.initCount;i++)
	{
		var conn = new Connection(this.createConnection());
		this.connections[conn.id] = conn;
	}
	setInterval(function(){
		var nowTime = new Date().getTime();
		for(var id in that.connections)
		{
			if(that.connections[id] == null){
				delete that.connections[id];
			}else{
				if(nowTime > that.connections[id].deadline){
					var conn = that.connections[id];
					that.connections[id] = null;
					delete that.connections[id];
					that.closeConnection(conn.connection,function(){
						delete conn;
						var newConn = new Connection(that.createConnection());
						that.connections[newConn.id] = newConn;
					});
				}
			}
		}
		for(var id in that.usedconnections)
		{
			if(that.usedconnections[id] == null){
				delete that.usedconnections[id];
			}
		}
	},interval);
}

module.exports = GDBPool;

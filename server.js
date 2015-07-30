/* global require, console, setTimeout*/

var http = require('http');
var cluster = require('cluster');
var os = require('os');
var _ = require('underscore');

var numCPU = os.cpus();
var workersIDs = [];

if(cluster.isMaster) {
  numCPU.forEach(function() {
    cluster.fork();
  });

  for(var wID in cluster.workers) {
    workersIDs.push(wID);
  }

  cluster.on('online', function(worker) {
    console.info('Worker : ' + worker.process.pid + ' created');
  });

  cluster.on('exit', function(worker, code, signal) {
    console.info('Worker : ' + worker.process.pid + ' exited');
  });

  setTimeout(function() {
    console.info('\nkill the first worker just for fun :)\n');
    var index = 0;
    var firstWorkerID = workersIDs[index];
    if(cluster.workers[firstWorkerID]) {
      cluster.workers[firstWorkerID].kill('SIGKILL');
      workersIDs = _.without(workersIDs, _.findWhere(workersIDs, index)); // delete array index
    }
  }, 1500);
  // kill the first worker after 1.5 sec

} else {
  http.createServer(function(req, res) {
    res.writeHead(200);
    res.end('Hello Node Clusters');
  }).listen(3000);

  //console.log('Server is running on Localhost:3000');
}
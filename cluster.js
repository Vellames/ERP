const cluster = require("cluster");
const cpus = require("os").cpus();

if(cluster.isMaster){
    for(var i = 0; i < cpus.length; i++){
        cluster.fork();
    }

    cluster.on("listening", function(worker){
        console.log("%d is listening now", worker.process.pid);
    });

    cluster.on("exit", function(worker){
        console.log("%d exit, restarting worker", worker.process.pid);
        cluster.fork();
    });
} else {
    require("./app");
}
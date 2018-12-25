//This is the javascript multithreading lib by yoav sarfaty

let thisSrc, workerMap, getThreadNumPromiseResolve;
try {
  thisSrc = document.currentScript.src;
} catch (e) {}

if (!thisSrc) {
  //0 index is reserved for main thread only
  workerMap = [0];
} else {
  workerMap = new Set();
}

function multithread(f, scope) {

  function getCodeText(f, scope) {
    let text = f.toString() + "\n";
    if (scope && scope.filter) {
      text += scope.filter(func => (func instanceof Function)).map(func => func.toString()).join("\n");
      text += "\n";
    }
    return text;
  }

  let workerOnMessage = function (e) {
    if (e.data.type == "run") {
      let res = original_function(...e.data.data);
      Promise.resolve(res).then((x) => {
        postMessage({
          data: x,
          type: "response",
          returnTo: e.data.returnTo,
        });
      });
    } else if (e.data.type == "response") {
      //worker got response from a different worker
      // find the promise in the map and resolve it
      workerMap[e.data.returnTo](e.data.data);
    } else if (e.data.type == "getThreadNum") {
      getThreadNumPromiseResolve(e.data.data);
    }
  }

  let worker_text = `
  importScripts("${thisSrc}");
  let original_function = ${getCodeText(f, scope)};
  onmessage = ${workerOnMessage.toString()}`;

  if (thisSrc) {
    return function () {
      return new Promise((resolve, reject) => {
        let worker = new Worker(URL.createObjectURL(new Blob([worker_text])));
        workerMap.add(worker);
        worker.postMessage({
          type: "run",
          data: [...arguments],
          returnTo: 0,
        });
        worker.onmessage = (e) => {
          if (e.data.type == "response") {
            if (e.data.returnTo == 0) {
              resolve(e.data.data);
              worker.terminate();
              workerMap.delete(worker);
            }
          } else if (e.data.type == "new") {
            //create a new worker for a different worker
            multithread(e.data.data)(...e.data.args).then((x) => {
              // console.log("x: ", x);
              worker.postMessage({
                returnTo: e.data.returnTo,
                type: "response",
                data: x
              });
            });
          } else if (e.data.type == "getThreadNum") {
            worker.postMessage({
              type: "getThreadNum",
              data: getThreadNum()
            });
          }
        };
      });
    }
  } else {
    return function () {
      // crete a worker on main thread by
      // posting the worker text to it, then make
      // the workermap to return the result back
      // to the worker that created it
      let mapresolve;
      let p = new Promise((resolve, reject) => {
        mapresolve = resolve;
      });

      workerMap.push(mapresolve);

      postMessage({
        data: getCodeText(f, scope),
        type: "new",
        args: Array.from(arguments),
        returnTo: workerMap.length - 1,
      });
      return p;
    }
  }
}

function getThreadNum() {
  if (thisSrc) {
    return workerMap.size;
  } else {
    postMessage({
      type: "getThreadNum"
    });
    return new Promise((resolve, reject) => {
      getThreadNumPromiseResolve = resolve;
      // i dont know why somtimes it never resolves
      // so this is so it doesnt get the worker stuck
      setTimeout(resolve, 50);
    });
  }
}
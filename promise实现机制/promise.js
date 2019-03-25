function  Promise(executor){
  var self = this;
  self.value = undefined;
  self.reason = undefined;
  self.status = 'pedding';
  self.onResolveCallBacks = [];
  self.onRejectCallBacks = [];
  function resolve(value){
    if(self.status === 'pedding'){
        self.value = value;
        self.status = 'resolve';
        self.onResolveCallBacks.forEach(fn=>fn());
    }
  }

  function reject(reason){
      if(self.status === 'pedding'){
        self.reason = reason;
        self.status = 'reject'
        self.onRejectCallBacks.forEach(fn=>fn());
      }
  }

  try{
      executor(resolve, reject);
  }catch(err){
      reject(err)
  }

}


Promise.prototype.then = function(onFullFilled, onRejected){
  var self = this;
  if(self.status === 'resolve'){
      onFullFilled(self.value)
  }
  if(self.status === 'reject'){
      onRejected(self.reason)
  }
  if(self.status === 'pedding'){
      self.onResolveCallBacks.push(()=>{onFullFilled(self.value)});
      self.onRejectCallBacks.push(()=>{onRejected(self.reason)});
  }
}

module.exports = Promise;
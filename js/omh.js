if(!omh) var omh = {}

omh.init = function(baseurl, requester){
  omh.baseurl = baseurl
  omh.requester = requester
}

omh.token = function(tok){
  if(tok)
    localStorage.setItem('omh.token',tok)
  return localStorage.getItem('omh.token')
} 

omh.username = function(tok){
  if(tok)
    localStorage.setItem('omh.username',tok)
  return localStorage.getItem('omh.username')
}

omh.initTest = function(){
  if(!omh.baseurl || !omh.requester){
    alert("no baseurl or requester established. Did you call omh.init(baseurl, requester)")
    return false
  }
  return true
}


//callback (optional) can be an object with success and failure functions  
omh.authenticate = function(user, password, callback){
  if(!omh.initTest())return
  omh.username(user)
  var url = omh.baseurl + '/omh/v1.0/authenticate'
  $.post(url,{
    user:user,
    password:password,
    requester:omh.requester
  },function(res){
    //res = $.parseJSON(res)
    if(res.auth_token){
      omh.token(res.auth_token)
      if(callback && callback.success)
        callback.success(res)
    }
    else{
      $.each(res.errors,function(){
        console.log(this)
      })
      if(callback && callback.failure)
        callback.failure(res)
    }
  })
}

omh.read = function(payloadID, payloadVersion, optional){
  if(!omh.initTest())return
  var url = omh.baseurl + '/omh/v1.0/read'
  if(!optional) optional = {}
  optional.auth_token = omh.token()
  optional.requester = omh.requester
  optional.payload_id = payloadID
  optional.payload_version = payloadVersion
  $.ajax({
    url: url,
    data:optional,
    type:'POST',
    success: function(res) {
      if(optional.success)
        optional.success(res)
    },
    failure:function(res){
      alert(res)
      if(optional.failure)
        optional.failure(res)
    }
  })
}

omh.logout = function(callback){
  var url = omh.url + 'omh/v1.0/logout'
  var params = {
    auth_token:omh.token(),
    client:omh.client
  }
  $.ajax({
    url: url,
    data:params,
    type:'POST',
    success: function(res) {
      localStorage.removeItem('omh.token')
      localStorage.removeItem('omh.username')
      if(callback && callback.success) callback(res)
    }
  });
}

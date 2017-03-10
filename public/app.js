var app = angular.module('LoginApp',[]);
app.controller('LoginTabs',function(){
  this.tabs = {
    login:true,
    register:false
  };
  this.showTab = function(id){
    if(id===1) {
      this.tabs.login=true;
      this.tabs.register=false;
    }
    if(id===2) {
      this.tabs.login=false;
      this.tabs.register=true;
    }
  };
});

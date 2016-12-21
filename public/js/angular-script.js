var app = angular.module('app',[]);

app.controller("mainController", function($scope){
  $scope.regRegEx="^\\d{2}([A-Z]|[a-z]){3}\\d{4}$";
  $scope.vitEmailRegEx="^([A-Z]|[a-z]){1,}(.){1}([A-Z]|[a-z]){1,}(@vit.ac.in)$"
});

app.controller("listController", function($scope,$http){
  $scope.getEvents=function(data){
    $http.get('/events/list').success(function(data){
      $scope.events=data.data;
    });
  }
});

app.controller("eventController", function($scope,$http){
  $scope.admin_dsw=[];
  $scope.manage_dsw=function(admin_dsw){
  var i=$scope.admin_dsw.indexOf(admin_dsw);
  if(i==-1){
    $scope.admin_dsw.push(admin_dsw);
  }
  else{
    $scope.admin_dsw.splice(i,1);
  }
}
  $scope.forward_dsw=function(){
    if($scope.admin_dsw.length==0){
      return;
    }
    var str="";
    $scope.admin_dsw.forEach(function(e){
      str=str+e+',';
    })
    str=str.slice(0, -1);
    obj={'eventFor': $scope.id, 'roles': str}
    $http.post('/dsw/forward', obj).success(function(res){
      if(res){
        window.location.href="/home";
      }
    })
  }

  $scope.admin=[];
  $scope.manage=function(admin){
  var i=$scope.admin.indexOf(admin);
  if(i==-1){
    $scope.admin.push(admin);
  }
  else{
    $scope.admin.splice(i,1);
  }
}
  $scope.forward=function(){
    if($scope.admin.length==0){
      return;
    }
    var str="";
    $scope.admin.forEach(function(e){
      str=str+e+',';
    })
    str=str.slice(0, -1);
    obj={'eventId': $scope.id, 'roles': str}
    $http.post('/dsw/forward', obj).success(function(res){
      if(res){
        window.location.href="/home";
      }
    })
  }
});

app.filter("clubOrChapterFilter", function(){
  return function(data, clubOrChapter){
      var list=[];
      if(clubOrChapter.length==0){
        list=data;
        return list;
      }
    data.forEach(function(e){
      var i=clubOrChapter.indexOf(e.conductingBodyType);
      if(i!=-1){
        list.push(e);
      }
    })
    return list;
  }
});

app.filter("faApprovalFilter", function(){
  return function(data, faApproval){
      var list=[];
      if(faApproval.length==0){
        list=data;
        return list;
      }
    data.forEach(function(e){
      var i=faApproval.indexOf(e.fcApproval);
      if(i!=-1){
        list.push(e);
      }
    })
    return list;
  }
});

  app.filter("approvalFilter", function(){
    return function(data, approval){
        var list=[];
        if(approval.length==0){
          list=data;
          return list;
        }
      data.forEach(function(e){
        var i=approval.indexOf(e.approvalStatus);
        if(i!=-1){
          list.push(e);
        }
      })
      return list;
    }
});

app.filter("dateFilter", function(){
  return function(data, startDate){
    if(startDate==undefined){
      return data;
    }
      var list=[];
      startDate=new Date(startDate);
      startDate=startDate.toString().substring(0, 15);
      data.forEach(function(e){
        date=new Date(e.startDate);
        date=(date).toString().substring(0, 15);
        console.log("sDate"+startDate+"\ndate:"+date)
        if(date==startDate){
          list.push(e);
        }
      })
      return list;
  }
});

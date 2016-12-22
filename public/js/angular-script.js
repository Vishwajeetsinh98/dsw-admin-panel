var app = angular.module('app',[]);

app.controller("mainController", function($scope){
  $scope.regRegEx="^\\d{2}([A-Z]|[a-z]){3}\\d{4}$";
  $scope.vitEmailRegEx="^([A-Z]|[a-z]){1,}(.){1}([A-Z]|[a-z]){1,}(@vit.ac.in)$"
});

app.controller("listController", function($scope,$http){
  $scope.formatDate=function(iDate){
    var date=new Date(iDate);
    var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
    var Fdate=date.getDate()+' '+months[date.getMonth()]+' '+date.getFullYear() ;
    return Fdate;
  }

  $scope.checkPending=function(approvals,role){
    if(approvals.length==0){
      return true;
    }
    approvals.forEach(function(e){
      if(e.by==role){
        return false;
      }
    })
    return true;
  }

  $scope.getEvents=function(data){
    $http.get('/events/list').success(function(data){
      $scope.events=data.data;
    });
  }
});

app.controller("eventController", function($scope,$http,$filter,$location){
  $scope.edit=false;

  $scope.initEvents=function(evt,role){
    $scope.role=role
    $scope.id=evt._id;
    $scope.startDate_model=$filter('date')(evt.startDate, 'yyyy-MM-dd');
    $scope.endDate_model=$filter('date')(evt.endDate, 'yyyy-MM-dd');
    $scope.startTime_model=$filter('date')(evt.startTime, 'HH:mm');
    $scope.duration_model=evt.duration;
    $scope.description_model=evt.eventDescription;
    $scope.participants_model=evt.eventParticipants;
    $scope.venue_model=evt.venueRequirement;
    $scope.budget_model=evt.budget;
    $scope.ceoRequest_model=evt.ceoRequest;
    $scope.proRequest_model=evt.proRequest;
    $scope.other_model=evt.other;
  }

  $scope.submit_form=function(){
    if($scope.endDate_model<$scope.startDate_model){
      alert("End Date Cannot be Smaller than Start Date");
      return false;
    }
    data={}
    count=1;
    var V="value";
    var F="field";
    if($scope.editEventForm.startDate.$dirty){
      ob={}
      ob[F+count]='startDate'
      ob[V+count]=$scope.startDate_model
      data=Object.assign(data,ob);
      count=count+1;
    }
    if($scope.editEventForm.endDate.$dirty){
      ob={}
      ob[F+count]='endDate'
      ob[V+count]=$scope.endDate_model
      data=Object.assign(data,ob);
      count=count+1;
    }
    if($scope.editEventForm.startTime.$dirty){
      ob={}
      ob[F+count]='startTime'
      ob[V+count]=$scope.startTime_model
      data=Object.assign(data,ob);
      count=count+1;
    }
    if($scope.editEventForm.duration.$dirty){
      ob={}
      ob[F+count]='duration'
      ob[V+count]=$scope.duration_model
      data=Object.assign(data,ob);
      count=count+1;
    }
    if($scope.editEventForm.eventDescription.$dirty){
      ob={}
      ob[F+count]='eventDescription'
      ob[V+count]=$scope.description_model
      data=Object.assign(data,ob);
      count=count+1;
    }
    if($scope.editEventForm.eventParticipants.$dirty){
      ob={}
      ob[F+count]='eventParticipants'
      ob[V+count]=$scope.participants_model
      data=Object.assign(data,ob);
      count=count+1;
    }
    if($scope.editEventForm.venueRequirement.$dirty){
      ob={}
      ob[F+count]='venueRequirement'
      ob[V+count]=$scope.venue_model
      data=Object.assign(data,ob);
      count=count+1;
    }
    if($scope.editEventForm.budget.$dirty){
      ob={}
      ob[F+count]='budget'
      ob[V+count]=$scope.budget_model
      data=Object.assign(data,ob);
      count=count+1;
    }
    if($scope.editEventForm.ceoRequest.$dirty){
      ob={}
      ob[F+count]='ceoRequest'
      ob[V+count]=$scope.ceoRequest_model
      data=Object.assign(data,ob);
      count=count+1;
    }
    if($scope.editEventForm.proRequest.$dirty){
      ob={}
      ob[F+count]='proRequest'
      ob[V+count]=$scope.proRequest_model
      data=Object.assign(data,ob);
      count=count+1;
    }
    if($scope.editEventForm.other.$dirty){
      ob={}
      ob[F+count]='other'
      ob[V+count]=$scope.other_model
      data=Object.assign(data,ob);
      count=count+1;
    }
    if(count==1){
      vex.dialog.alert({
          message: "No Changes Made"
      })
      return;
    }
    data["eventFor"]=$scope.id;
    data["length"]=count-1;
    if($scope.role=='dsw'){
      $http.post('/dsw/editevent', data).success(function(data){
        var route="/events/"+$scope.id;
        window.location.href=route;
      }).error(function(err){
        console.log(err);
      })
    }else{
      $http.post('/admin/editevent', data).success(function(data){
        var route="/events/"+$scope.id;
        window.location.href=route;
      }).error(function(err){
        console.log(err);
      })
    }
  }

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
    obj={'eventId': $scope.id, 'roles': str}
    $http.post('/dsw/forward', obj).success(function(res){
      if(res){
        vex.dialog.confirm({
          message: 'Forwarded Successfully\nGoto Home?',
          callback: function(value){
            if(value){
              window.location.href="/home";
            }
          }
        })
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
    $http.post('/admin/forward', obj).success(function(res){
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
      if(faApproval.indexOf('pending')!=-1){
        data.forEach(function(e){
          var flag=true;
          if(!e.faApproval){
            e.approvals.forEach(function(a){
              if(a.by=='fc'){
                flag=false;
              }
            })
            if(flag){
              list.push(e);
            }
          }
        })
      }
    data.forEach(function(e){
      var i=faApproval.indexOf(e.fcApproval);
      if(i!=-1){
        if(!e.fcApproval){
          e.approvals.forEach(function(a){
            if(a.by=='fc'){
              list.push(e);
            }
          })
        }else{
          list.push(e);
        }
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
        if(approval.indexOf('pending')!=-1){
          data.forEach(function(e){
            var flag=true;
            if(!e.approvalStatus){
              e.approvals.forEach(function(a){
                if(a.by=='dsw'){
                  flag=false;
                }
              })
              if(flag){
                list.push(e);
              }
            }
          })
        }
      data.forEach(function(e){
        var i=approval.indexOf(e.approvalStatus);
        if(i!=-1){
          if(!e.approvalStatus){
            e.approvals.forEach(function(a){
              if(a.by=='dsw'){
                list.push(e);
              }
            })
          }else{
            list.push(e);
          }
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

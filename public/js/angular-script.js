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
app.controller("allEventsController", function($scope,$http){
  $scope.init=function(data){
    $scope.events=data;
  }
});

var app = angular.module('app',[]);

app.controller("mainController", function($scope){
  $scope.emailRegEx="/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/";
  $scope.regRegEx="^\\d{2}([A-Z]|[a-z]){3}\\d{4}$"

});

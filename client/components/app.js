//app.js
angular.module('angular-app', [])
.component('app', {
  templateUrl: 'client/templates/app.html',
  controller: function($http) {
    //ensures that the this scope isn't lost
    let $ctrl = this;
    $ctrl.tasks = [];
    $http.get('/api/tasks').then(function(res) {
      res.data.forEach((obj) => {
        $ctrl.tasks.push(obj);
      })
    })
  }
});
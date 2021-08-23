'use strict';

(async function () {
  const app = angular.module('parserApp', [])
  app.controller('parserController', async function ($scope, $http) {
    const localAddress = 'http://127.0.0.1:3000'
    $http.get(localAddress + '/settings').then(response => {
      $scope.settings = response.data;
      $scope.sites = $scope.settings.map(v => v.site);
      $scope.options = {
        dropdowns: [
          { id: 0, title: 'First service', options: $scope.sites, active_index: 0 },
          { id: 1, title: 'Second service', options: $scope.sites, active_index: 1 },
          { id: 2, title: 'Unstable1', options: ['ON', 'OFF'], active_index: 0 },
          { id: 3, title: 'Unstable2', options: ['ON', 'OFF'], active_index: 0 }
        ],
      }
      $scope.items = [{
        item_name: 'none',
        price_1: 'none',
        price_2: 'none',
        diff: 'none',
        status_1: 'none',
        status_2: 'none'
      }]
    });
  });

})()

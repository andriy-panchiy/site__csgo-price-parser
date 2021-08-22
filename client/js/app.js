"use strict";

(async function () {
  const app = angular.module('parserApp', [])
  app.controller('parserController', async function ($scope) {
    const localAddress = 'http://127.0.0.1:3000'

    $scope.settings = await fetch(localAddress + '/settings').then(r => r.json());
    $scope.options = [];


    console.dir($scope.options)

  })

})()

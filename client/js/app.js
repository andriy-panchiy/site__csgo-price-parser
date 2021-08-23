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
        ]
      }
      $scope.orderType = 'diff'
      $scope.orderReverse = false
      $scope.items = [{
        item_name: 'none',
        price_0: 'none',
        price_1: 'none',
        diff: 'none',
        status_0: 'none',
        status_1: 'none'
      }];

      $scope.upload_service = async () => {
        $scope.settings = {
          active_sites: [
            $scope.options.dropdowns[0].options[$scope.options.dropdowns[0].active_index],
            $scope.options.dropdowns[1].options[$scope.options.dropdowns[1].active_index]
          ],
          alerts: {
            success: null,
            info: null,
            warning: null,
            error: null
          }
        }
        if ($scope.settings.active_sites[0] === $scope.settings.active_sites[1]) {
          $scope.settings.alerts.error = 'The choice of the first service corresponds to the choice of the second service, please change one of the selected services';
          return;
        }

        $scope.loadBase = (index) => $http.get(localAddress + '/prices?site=' + $scope.settings.active_sites[index])

        await Promise.all([$scope.loadBase(0), $scope.loadBase(1)]).then(resp => {
          const respParse = (r, param) => r.data[param] ? JSON.parse(r.data[param]) : null;
          $scope.sites_bases = {
            base_0: {
              updated_at: new Date().getTime(),
              base: {
                prices: respParse(resp[0], "prices"),
                overstock: respParse(resp[0], "overstock"),
                unavailable: respParse(resp[0], "unavailable"),
                highDemand: respParse(resp[0], "highDemand"),
              }
            },
            base_1: {
              updated_at: new Date().getTime(),
              base: {
                prices: respParse(resp[1], "prices"),
                overstock: respParse(resp[1], "overstock"),
                unavailable: respParse(resp[1], "unavailable"),
                highDemand: respParse(resp[1], "highDemand"),
              }
            },
          }
          const items = [];
          const names = Object.keys($scope.sites_bases.base_0.base.prices);
          const diff = (price_0, price_1) => price_0 ? +(((price_0 - price_1) / price_0) * 100).toFixed(2) : 0;
          const status = (base, name) => {
            let res = 'none';
            if (base.overstock && base.overstock[name]) res = 'overstock';
            if (base.unavailable && base.unavailable[name]) res = 'unavailable';
            if (base.highDemand && base.highDemand[name]) res = 'highDemand';
            return res;
          };
          for (let name of names) {
            if ($scope.sites_bases.base_1.base.prices[name] != null){
              items.push({
                item_name: name,
                price_0: $scope.sites_bases.base_0.base.prices[name],
                price_1: $scope.sites_bases.base_1.base.prices[name],
                diff: diff($scope.sites_bases.base_0.base.prices[name], $scope.sites_bases.base_1.base.prices[name]),
                status_0: status($scope.sites_bases.base_0.base, name),
                status_1: status($scope.sites_bases.base_1.base, name)
              });
            }
          }
          console.log(items)
          $scope.items = items;
        }).catch()

        console.log($scope)
      }
      $scope.upload_service();
      $scope.setOption = async (dropdown, option) => {
        dropdown.active_index = dropdown.options.indexOf(option);
        $scope.upload_service();
      }
      $scope.changeSortType = (orderType) => {
        if ($scope.orderType == orderType) {
          $scope.orderReverse = !$scope.orderReverse
        } else {
          $scope.orderType = orderType
        }
      }
      $scope.isSortType = (orderType) => $scope.orderType == orderType
      $scope.isOrderedReverse = () => !$scope.orderReverse

    });
  });

})()

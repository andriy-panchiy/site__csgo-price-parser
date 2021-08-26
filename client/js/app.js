'use strict';

(async function () {
  const app = angular.module('parserApp', [])
  app.controller('parserController', async function ($scope, $http, $filter) {
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
      $scope.settings = {
        active_sites: [
          null, null
        ],
        alerts: {
          success: null,
          info: null,
          warning: null,
          error: null
        },
        orderType: 'diff',
        orderReverse: false,
        currentPage: 0,
        min_price_0: 0,
        max_price_0: 5000,
        min_price_1: 0,
        max_price_1: 5000,
        min_diff: -1000,
        max_diff: 1000,
        maxButton: 5,
        pageSize: 10,
        search: ''
      }
      $scope.items = [{
        item_name: 'none',
        price_0: 'none',
        price_1: 'none',
        diff: 'none',
        status_0: 'none',
        status_1: 'none'
      }];

      $scope.itemsPerPage = angular.isDefined($scope.itemsPerPage) ? $scope.itemsPerPage : [...Array($scope.settings.maxButton).keys()].map(number => (number+1)*10);

      $scope.getData = () => {
        return $scope.items.filter((item) => {
          let by_name = item.item_name.indexOf($scope.settings.search) != -1;
          let by_price_0 = item.price_0 >= $scope.settings.min_price_0 && item.price_0 <= $scope.settings.max_price_0;
          let by_price_1 = item.price_1 >= $scope.settings.min_price_1 && item.price_1 <= $scope.settings.max_price_1;
          let by_diff = item.diff >= $scope.settings.min_diff && item.diff <= $scope.settings.max_diff;
          return by_name && by_price_0 && by_price_1 && by_diff;
        })
      }
      $scope.numberOfPages = () => Math.ceil($scope.getData().length/$scope.settings.pageSize);
      $scope.upload_service = async () => {
        $scope.settings.active_sites = [
          $scope.options.dropdowns[0].options[$scope.options.dropdowns[0].active_index],
          $scope.options.dropdowns[1].options[$scope.options.dropdowns[1].active_index]
        ]
        $scope.settings.alerts = {
          success: null,
          info: null,
          warning: null,
          error: null
        }
        if ($scope.settings.active_sites[0] === $scope.settings.active_sites[1]) {
          $scope.settings.alerts.error = 'The choice of the first service corresponds to the choice of the second service, please change one of the selected services';
          return;
        }

        $scope.loadBase = (index) => $http.get(localAddress + '/prices?site=' + $scope.settings.active_sites[index])

        $scope.items = await Promise.all([$scope.loadBase(0), $scope.loadBase(1)]).then(resp => {
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
          const diff = (price_0, price_1) => price_1 ? +(((price_1 - price_0) / price_1) * 100).toFixed(2) : 0;
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
          return items;
        })
        $scope.$apply();
        console.log($scope)
      }
      $scope.upload_service();
      $scope.setOption = async (dropdown, option) => {
        dropdown.active_index = dropdown.options.indexOf(option);
        $scope.upload_service();
      }
      $scope.changeSortType = (orderType) => {
        if ($scope.settings.orderType == orderType) {
          $scope.settings.orderReverse = !$scope.settings.orderReverse
        } else {
          $scope.settings.orderType = orderType
        }
      }
      $scope.isSortType = (orderType) => $scope.settings.orderType == orderType
      $scope.isOrderedReverse = () => !$scope.settings.orderReverse

    });
  });

  app.filter('range', function () {
    return function (items, property, min, max) {
      // console.log(items, property, min, max);
      return items.filter((item) => item[property] >= min && item[property] <= max)
    }
  });
  app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
  });

})()

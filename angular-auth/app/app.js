(function (angular) {

    angular
        .module('app', [
            'ngRoute',
            'ngStorage'
        ])
        .config(function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: './../templates/home.html',
                    controller: 'HomeController',
                    controllerAs: 'home_vm'
                })
                .when('/login', {
                    templateUrl: './../templates/login.html',
                    controller: 'LoginController',
                    controllerAs: 'login_vm'
                })
                .when('/route', {
                    templateUrl: './../templates/route.html',
                    auth: true
                })
        })
        .config(function($httpProvider) {
            $httpProvider.interceptors.push('AuthInterceptor');
        })
        .factory('Auth', function($localStorage) {
            return {
                getToken: function() {
                    return $localStorage.token;
                },
                setToken: function(_token) {
                    $localStorage.token = _token;
                }
            }
        })
        .run(function($rootScope, $location, Auth) {
            $rootScope.$on('$routeChangeStart', function(event, next, current) {
                if (next.auth) {
                    if (!Auth.getToken()) {
                        $rootScope.$evalAsync(function() {
                            $location.path('login')
                        });
                    }
                }
            })
        })
        .factory('AuthInterceptor', function($location, Auth, $q) {
            return {
                request: function(config) {
                    config.headers = config.headers || {};

                    if (Auth.getToken()) {
                        config.headers['Authorization'] = 'Bearer ' + Auth.getToken();
                    }

                    return config;
                },

                responseError: function(response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }

                    return $q.reject(response);
                }
            }
        })
        .controller('LoginController', function LoginCtrl($http, Auth, $location) {
            var vm = this;

            vm.form = {
                username: '',
                password: ''
            };

            vm.login = function(form) {
                // services
                $http({
                    method: 'POST',
                    url: 'http://localhost:3000/users/auth',
                    data: form
                }).then(function(response) {
                    Auth.setToken(response.data.user.access_token);
                    console.log(Auth.getToken());
                    $location.path('/');
                }).catch(function(error) {
                    console.log('Error')
                });
            }
        })
        .controller('HomeController', function($http) {
            var vm = this;

            vm.call = call;

            function call() {
                $http({
                    method: 'GET',
                    url: 'http://localhost:3000/users/hello'
                }).then(function(response) {
                    console.log(response);
                }).catch(function(error) {
                    console.log('Error')
                });
            }
        });

})(angular);
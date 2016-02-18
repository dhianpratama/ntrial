angular.module('Jiggie-Test')
    .factory('AuthenticationService', [
        '$resource', function ($resource) {
            return $resource('/Api/Auth/:verb', {}, {
                Login: {
                    method: 'POST',
                    params: {
                        verb: 'Login'

                    }
                },
                IsLogin: {
                    method: 'POST',
                    params: {
                        verb: 'IsLogin'
                    }
                },
                Logout: {
                    method: 'POST',
                    params: {
                        verb: 'Logout'
                    }
                },
                GoToLoginPage: {
                    method: 'POST',
                    params: {
                        verb: 'GoToLoginPage'
                    }
                },
                SignUp: {
                    method: 'POST',
                    params: {
                        verb: 'SignUp'
                    }
                }
            });
        }
    ])
    .factory('UserService', [
        '$resource', function ($resource) {
            return $resource('/Api/user/:verb', {}, {
                GetAll: {
                    method: 'POST',
                    params: {
                        verb: 'GetAll'
                    }
                },
                GetAllExceptMe: {
                    method: 'POST',
                    params: {
                        verb: 'GetAllExceptMe'
                    }
                },
                Save: {
                    method: 'POST',
                    params: {
                        verb: 'Save'
                    }
                },
                Delete: {
                    method: 'POST',
                    params: {
                        verb: 'Delete'
                    }
                },
                GetCurrentUser: {
                    method: 'POST',
                    params: {
                        verb: 'GetCurrentUser'
                    }
                },
            });
        }
    ])

    .factory('ChatRoomService', [
        '$resource', function ($resource) {
            return $resource('/Api/Chat/:verb', {}, {
                GetChatRoom: {
                    method: 'POST',
                    params: {
                        verb: 'GetChatRoom'
                    }
                },
                GetGroups: {
                    method: 'POST',
                    params: {
                        verb: 'GetGroups'
                    }
                },
                GetGroupChatRoom: {
                    method: 'POST',
                    params: {
                        verb: 'GetGroupChatRoom'
                    }
                }
            });
        }
    ])
;


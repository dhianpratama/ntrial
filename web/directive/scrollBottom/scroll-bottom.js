/**
 * Created by Dhian on 2/15/2016.
 */
angular.module('Jiggie-Test').directive('scrollBottom', function () {
    return {
        scope: {
            scrollBottom: "="
        },
        link: function (scope, element) {
            scope.$watchCollection('scrollBottom', function (newValue) {
                if (newValue)
                {
                    var x = $(element);
                    var a = $(element)[0];
                    $(element).scrollTop(a.scrollHeight);
                }
            });
        }
    }
})
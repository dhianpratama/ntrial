/**
 * Created by Dhian on 2/15/2016.
 */
angular.module('Jiggie-Test').directive('scrollToLast', ['$location', '$anchorScroll', function($location, $anchorScroll){

    function linkFn(scope, element, attrs){
        console.log("ATTRS", attrs);
        $location.hash(attrs.scrollToLast);
        $anchorScroll();
    }

    return {
        restrict: 'AE',
        scope: {

        },
        link: linkFn
    };

}]);
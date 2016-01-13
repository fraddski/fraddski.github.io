(function(){
  var app = angular.module('bingo', ['ngTouch']);

  app.controller('gameController', ['$http', '$scope', function($http, $scope){
    var numWords = 9;
    var gameCtrl = this;
    gameCtrl.game = { words: [], isStarted: false };
    $scope.newGameStarted = false;

    this.newGame = function(){
      gameCtrl.game = { words: [], isStarted: true, isOver: false };
      $http.get('buzzwords.json').success(function(data){
        var randomWords = getRandomEntries(data, numWords);
        for (var i=0; i < numWords; i++) {
          gameCtrl.game.words.push({ word: randomWords[i], isCalled: false });
        }
        $scope.newGameStarted = true;
      })
      .error(function(){
        console.log('Failed to retrieve buzzwords');
      });
    };

    this.wordCalled = function(buzzword){
      buzzword.isCalled = true;

      for (var i=0; i < this.game.words.length; i++) {
        if (!this.game.words[i].isCalled) {
          return;
        }
      }

      this.game.isOver = true;
    };

    function getRandomEntries(array, numToSelect){
      var selected = [];
      var indicies = [];

      if (numToSelect >= array.length) {
        return array;
      }

      var curr;
      for (var i=0; i < numToSelect; i++){
        curr = Math.floor(Math.random() * array.length);

        while (indicies.indexOf(curr) >= 0) {
          curr = Math.floor(Math.random() * array.length);
        }

        indicies.push(curr);
        selected.push(array[curr]);
      }

      return selected;
    }
  }]);

  app.directive('setFocus', function($timeout, $parse) {
    return {
      link: function(scope, element, attrs) {
        scope.$watch(attrs.setFocus, function(value) {
          if(value === true) {
            $timeout(function() {
              element[0].focus();
              scope[attrs.setFocus] = false;
            });
          }
        });
      }
    };
  });

})();

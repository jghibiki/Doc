'use strict';

describe('doc.player module', function() {
	var playerCtrl, $scope, socket = null; 

	beforeEach(module('doc.player'));

	beforeEach(inject(function($rootScope, $controller){

		$scope = $rootScope.$new();

		socket = {
			on: function(){},
			emit: function(){}
		};

		playerCtrl = $controller('PlayerCtrl', {
			$scope: $scope,
			socket: socket
		});

	}));

	describe('player controller', function(){

		it('should ....', inject(function($controller) {
			//spec body
			expect(playerCtrl).toBeDefined();
		}));

	});
});
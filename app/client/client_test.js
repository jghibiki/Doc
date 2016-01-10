'use strict';

describe('doc.client module', function() {
	var clientCtrl, $scope, queue, search, playback = null;; 

	beforeEach(module('doc.client'));

	beforeEach(inject(function($rootScope, $controller) {
		$scope = $rootScope.$new();

		queue = {
			get: function(){}
		};

		search = {

		};

		playback = {

		};

		clientCtrl = $controller('ClientCtrl', {
			$scope: $scope,
			queue: queue,
			search: search,
			playback: playback
		});
	}));  

	afterEach(function(){
		clientCtrl, $scope, queue, search, playback = null;
	})

	describe('client controller', function(){

		it('should initialize values to sane defaults',inject(function() {
			//spec bod
			expect($scope.queue.length).toBe(0);
			expect($scope.currentlyPlaying).toBe(null);
			expect($scope.relatedCheckbox).toBe(false);
			expect($scope.recentCheckbox).toBe(false);
			expect($scope.relatedToRecentCheckbox).toBe(false);
			expect($scope.showControls).toBe(false);
			expect($scope.playbackState).toBe(false);

		}));

	});
});
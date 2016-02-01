'use strict';

describe('doc.client module', function() {
    var clientCtrl, $scope, queue, search, playback = null;; 

    beforeEach(module('doc.client'));

    beforeEach(inject(function($rootScope) {
        $scope = $rootScope.$new();

        queue = jasmine.createSpyObj("queue", [
            "get",
            "add"
        ]);
        search = jasmine.createSpy("search");

        playback = jasmine.createSpyObj("playback", [
            "getRecent",
            "setRecent",
            "clearRecentList",
            "getRelatedToRecent",
            "setRelatedToRecent",
            "getRelated",
            "setRelated",
            "skip",
            "getState",
            "setState"  
        ]);

    }));  

    afterEach(function(){
        clientCtrl, $scope, queue, search, playback = null;
    })

    function initClientctrl($controller){
            clientCtrl = $controller('ClientCtrl', {
                $scope: $scope,
                queue: queue,
                search: search,
                playback: playback
            });
    }

    describe('client controller', function(){

        it('should initialize values to sane defaults',inject(function($controller) {
            //spec bod

            initClientctrl($controller);

            expect($scope.queue.length).toBe(0);
            expect($scope.currentlyPlaying).toBe(null);
            expect($scope.chk.related).toBe(false);
            expect($scope.chk.recent).toBe(false);
            expect($scope.chk.relatedToRecent).toBe(false);
            expect($scope.showControls).toBe(false);
            expect($scope.playbackState).toBe(false);
            expect($scope.playbackStateMessage).toBe("Resume Playback");
            expect($scope.playbackStateMessage).toBe("fa fa-play fa-2x");
            expect($scope.magicModeState).toBe(false);

        }));

        it('should update the queue', inject(function($controller){
            var expected = ["a", "b", "c"]
            queue.get.and.callFake(function(callback){
                callback({queue: expected});
            });

            initClientctrl($controller);

            expect(queue.get.calls.count()).toEqual(1);
            expect($scope.queue).toBe(expected);
        }));

        it('should call playback.skip when skip is called', inject(function($controller){

            initClientctrl($controller);

            $scope.skipSong();

            expect(playback.skip.calls.count()).toBe(1);

        }));

        it('should call playback.setRelated and set $scope.chk.related when relatedCheckboxClicked is called', inject(function($controller){
            
            var expected1 = true;
            var expected2 = false;


            initClientctrl($controller);

            playback.setRelated.and.callFake(function(value, callback){
                callback({state: expected1});
            });

            expect($scope.chk.related).toBe(false);
            expect(playback.setRelated.calls.count()).toBe(0);

            $scope.relatedCheckboxClicked();

            expect(playback.setRelated.calls.count()).toBe(1);
            expect($scope.chk.related).toBe(expected1);

            playback.setRelated.and.callFake(function(value, callback){
                callback({state: expected2});
            });

            $scope.relatedCheckboxClicked();

            expect(playback.setRelated.calls.count()).toBe(2);
            expect($scope.chk.related).toBe(expected2);


        }));

        it('should not do anything when $scope.showControl === true',inject(function($controller){
            initClientctrl($controller);

            var expected = true;

            playback.getRelated.and.callFake(function(callback){
                callback({state: expected});
            });

            expect($scope.chk.related).toBe(false);
            expect(playback.getRelated.calls.count()).toBe(0);

            $scope.updateRelatedCheckbox();

            expect($scope.chk.related).toBe(false);
            expect(playback.getRelated.calls.count()).toBe(0);

        }));

        it('should call playback.getRelated and $scope.chk.related when updateRelatedCheckbox is called and $scope.showControl === true', inject(function($controller){

            var expected1 = true;
            var expected2 = false;

            initClientctrl($controller);

            $scope.showControls = true;

            playback.getRelated.and.callFake(function(callback){
                callback({state: expected1});
            })

            expect($scope.chk.related).toBe(false);
            expect(playback.getRelated.calls.count()).toBe(0);

            $scope.updateRelatedCheckbox();

            expect($scope.chk.related).toBe(expected1);
            expect(playback.getRelated.calls.count()).toBe(1);

            playback.getRelated.and.callFake(function(callback){
                callback({state: expected2});
            })

            $scope.updateRelatedCheckbox();

            expect($scope.chk.related).toBe(expected2);
            expect(playback.getRelated.calls.count()).toBe(2);

        }));

        it('should call playback clearRecentList when clearRecent is called', inject(function($controller){
            initClientctrl($controller);

            expect(playback.clearRecentList.calls.count()).toBe(0);

            $scope.clearRecent();

            expect(playback.clearRecentList.calls.count()).toBe(1);

        }));

        it('should call playback.setRelatedToRecent when relatedToRecentCheckboxClicked is called.', inject(function($controller){
            initClientctrl($controller);

            playback.setRelatedToRecent.and.callFake(function(value, callback){
                callback({state: value});
            });

            expect($scope.chk.relatedToRecent).toBe(false);
            expect(playback.setRelatedToRecent.calls.count()).toBe(0);

            $scope.chk.relatedToRecent = true;
            $scope.relatedToRecentCheckboxClicked();

            expect($scope.chk.relatedToRecent).toBe(true);
            expect(playback.setRelatedToRecent.calls.count()).toBe(1);

        }))

    });
});
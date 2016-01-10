'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to / when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/");
  });

  it("should dispaly the correct title for the page", function(){
    browser.get('index.html');
    expect(browser.getTitle()).toEqual('Doc');    
  });


  describe('client', function() {

    beforeEach(function() {
      browser.get('index.html#/client');
    });


    it('should render client when user navigates to /client', function() {
      expect(element.all(by.css('[ng-view] h3')).first().getText()).
        toMatch(/Currently Playing/);
    });

  });


  describe('player', function() {

    beforeEach(function() {
      browser.get('index.html#/player');
    });


    it('should render player when user navigates to /player', function() {
      expect(element.all(by.css('[ng-view] div em')).first().getText()).
        toMatch(/Nothing is playing. Go to mopey.ndacm.org to request a song./);
    });

  });
});

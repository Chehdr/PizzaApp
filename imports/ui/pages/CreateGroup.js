import './CreateGroup.html';
import '../../api/errors/methods.js';

Template.CreateGroup.helpers({
	AfterLoad: function() {
    	return {
        	finished: function(index, fileInfo, context) {
				ImagePlace.innerHTML = '<img class="img-thumbnail" width="150" height="150" src=\''+ fileInfo.url + '\'>';
				Session.set("Image", fileInfo.url);
        	}
    	}
  	}
});

Template.CreateGroup.events({
	'click button ': function(e, i) {
  		'use strict';
  		event.preventDefault();
  		let [name, image] = [GroupNameID.value, Session.get('Image')];
  		if(name && image){
  			Meteor.call('UserToAdminInGroup', name, image);
  			FlowRouter.go('/');
  		}else{
  			Meteor.Errors.alertError('groupError');
  		}
  	}
});
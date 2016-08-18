import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

import './CreateGroup.html';
import '../../api/errors/methods.js';

Template.CreateGroup.helpers({
	AfterLoad: function() {
   	return {
     	finished: function(index, fileInfo, context) {
		    Session.set("Image", fileInfo.url);
     	}
   	}
  },
  ImageGroup: function(){
    let url = Session.get('Image');
    if (url){
      return url
    }else{
      return false
    }
  }
});

Template.CreateGroup.events({
	'click button ': function(e, i) {
  	event.preventDefault();
  	let [name, image] = [GroupNameID.value, Session.get('Image')];
  	if(name && image){
  		Meteor.call('CreateGroup', name, image);
  		FlowRouter.go('/');
  	}else{
  		Meteor.Errors.alertError('groupError');
  	}
  }
});

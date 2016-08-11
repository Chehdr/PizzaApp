import './body.html';
import '/imports/ui/stylesheets/style.css'; 

import { Meteor } from 'meteor/meteor';

Template.home.events({
	'click #LeaveGroupID': function(e, i){
		Meteor.call('LeaveGroup');
	}
});

Template.AdminLeftPanel.events({
	'click #deleteGroupID': function(e, i){
		Meteor.call('DeleteGroup');
	}
});
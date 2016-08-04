import './body.html';
import '/imports/ui/stylesheets/style.css'; 

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

Template.home.events({
	'click #deleteGroupID': function(e, i){
		Meteor.call('DeleteGroup');
	},
	'click #LeaveGroupID': function(e, i){
		Meteor.call('LeaveGroup');

	}
});
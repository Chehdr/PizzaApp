import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

import './InvatesToGroup.html';
import '../../api/groups/groups.js';


Template.InvatesToGroup.helpers({
	UserInvites: function(){
        Meteor.subscribe('Groups');
        return Groups.find({invite:{'userId': Meteor.userId()}});  
    }
});

Template.InvatesToGroup.events({
	'click #DeclineInviteToGroupID' : function(e, i){
    	Meteor.call('DeclineInviteToGroup', this._id)
  	},
    'click #AcceptInviteToGroupID' : function(e, i){
    	Meteor.call('AcceptInviteToGroup', this._id)
    	FlowRouter.go('/');
  	},
});

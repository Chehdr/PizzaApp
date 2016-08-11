import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './GroupList.html';
import '../../api/groups/groups.js';

Template.GroupList.helpers({
	GroupInfo:function(){
        Meteor.subscribe('Groups');
        return Groups.findOne({AdminGroup: Meteor.userId()});   
	},

  	UsersInGroup: function(){
   		Meteor.subscribe('Groups');
    	Meteor.subscribe('AllUsers');
    	let users =  Groups.findOne({AdminGroup: Meteor.userId()});
    	if(users){
      		return Meteor.users.find( { _id : { $in : users.users} } );
    	}
  	}
});

Template.GroupList.events({
	'click #RemoveUserFromGroupID' : function(e, i){
    	Meteor.call('RemoveUserFromGroup', this._id);
  	}
});
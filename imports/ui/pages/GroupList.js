import './GroupList.html';
import '../../api/groups/groups.js';

Template.GroupList.helpers({
	GroupInfo:function(){
        Meteor.subscribe('GroupsInfo');
        return GroupsInfo.findOne({AdminGroup: Meteor.userId()});   
	},

  	UsersInGroup: function(){
   		Meteor.subscribe('GroupsInfo');
    	Meteor.subscribe('AllUsers');
    	let users =  GroupsInfo.findOne({AdminGroup: Meteor.userId()});
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
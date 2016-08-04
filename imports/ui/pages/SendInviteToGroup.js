import './SendInviteToGroup.html';
import '../../api/groups/groups.js';


Template.SendInviteToGroup.events({
	'click button ': function(e, i) {
    	Meteor.call('SendInvite', this._id);
	}
});

Template.SendInviteToGroup.helpers({
	InviteToUser: function(){
        Meteor.subscribe('GroupsInfo');
        Meteor.subscribe('AllUsers');
        let users = GroupsInfo.findOne({AdminGroup: Meteor.userId()}, {fields:{'invite':1}});
        let sended = [];
        if(users){
            sended = _.pluck(users.invite, 'userId').concat(Meteor.userId());
        }else{
            sended = [Meteor.userId()];
        }
	    	return Meteor.users.find({_id:{$nin:sended}});  
	},

	UserInGroup: function(){
    	if(Roles.userIsInRole(this._id, 'admin') || Roles.userIsInRole(this._id, 'custumer')){
      		return false
   		}else{
      		return true
    	}
	}
});
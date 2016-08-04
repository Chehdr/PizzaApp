import './Event.html';
import '../../api/groups/groups.js';
import '../../api/orders/methods.js';

Template.Event.helpers({
	GroupInfo: function(){
	Meteor.subscribe('GroupsInfo');   
        if(Roles.userIsInRole(Meteor.userId(), 'admin')){
            return GroupsInfo.findOne({'AdminGroup': Meteor.userId()});
        }else{
            return GroupsInfo.findOne( { 'users': { $in: [Meteor.userId() ] } } )
        }  
	},
	UserInEvent: function(){
    	Meteor.subscribe('GroupsInfo');
    	if(this.accepts.indexOf(Meteor.userId()) >= 0){
      		return true
    	}else{
      		return false
    	}
  	},
  	UserIsAdminEvent: function(){
    	if(this.createUser == Meteor.userId()){
      		return true
    	}else{
      		return false
    	}
  	}
});

Template.Event.events({
	'click #CreateEventID' : function(e, i){
    	if(NameNewEvent.value){
      		Meteor.call('CreateEvent', NameNewEvent.value);
     	}else{
      		Meteor.Errors.alertError('EventError');
  		}
	},
  	'click #RemoveEventID' : function(e, i){
    	Meteor.call('RemoveEvent', e.currentTarget.attributes.name.value);
  	},
  	'click #JoinToEventID' : function(e, i){
    	Meteor.call('JoinToEvent', e.currentTarget.attributes.idgroup.value, this.eventName);
  	},
  	'click #AddOrderToEventID' : function(e, i){
    	Session.set('EventName', e.currentTarget.attributes.name.value);
      Session.set('IdGroup', e.currentTarget.attributes.idgroup.value);
      FlowRouter.go('AddItemsToOrder');
  	},
  	'click #StatusEventID' : function(e, i){
  		Meteor.Order.CheckStatus(this.eventName, e.currentTarget.attributes.status.value, this.orders, e.currentTarget.attributes.idgroup.value);
	}
});

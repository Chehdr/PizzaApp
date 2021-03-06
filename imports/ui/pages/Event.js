import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

import './Event.html';
import '../../api/groups/groups.js';
import '../../api/events/events.js';
import '../../api/orders/sendorders.js';

Template.Event.helpers({
	GroupInfo: function(){
    var group;
    Meteor.subscribe('Events');  
    Meteor.subscribe('Groups'); 
    if(Roles.userIsInRole(Meteor.userId(), 'admin')){
      group = Groups.findOne({'AdminGroup': Meteor.userId()});
    }else{
      group = Groups.findOne( { 'users': { $in: [Meteor.userId() ] } } );
    }
    if(group){
      return Events.find({'GroupId': group._id});
    }
	},
	UserInEvent: function(){
    Meteor.subscribe('Groups');
    return this.accepts.indexOf(Meteor.userId()) >= 0;
    
  },
  UserIsAdminEvent: function(){
   		return this.createUser == Meteor.userId()

  },
  GroupId: function(){
    Meteor.subscribe('Groups'); 
    if(Roles.userIsInRole(Meteor.userId(), 'admin')){
      return Groups.findOne({'AdminGroup': Meteor.userId()});
    }else{
      return Groups.findOne( { 'users': { $in: [Meteor.userId() ] } } )
    }
  }
});

Template.Event.events({
	'click #CreateEventID' : function(e, i){
    if(NameNewEvent.value){
    	Meteor.call('CreateEvent', NameNewEvent.value, e.currentTarget.attributes.idgroup.value);
    }else{
    	Meteor.Errors.alertError('EventError');
  	}
	},
  'click #RemoveEventID' : function(e, i){
   	Meteor.call('RemoveEvent', e.currentTarget.attributes.idevent.value);
  },
  'click #ResetEventID' : function(e, i){
    StatusEventID.classList.remove('disabled');
    Meteor.call('ResetEvent', e.currentTarget.attributes.idevent.value);
  },
  'click #JoinToEventID' : function(e, i){
   	Meteor.call('JoinToEvent', e.currentTarget.attributes.idevent.value);
  },
  'click #AddOrderToEventID' : function(e, i){
   	Session.set('IdEvent', e.currentTarget.attributes.idevent.value);
    Session.set('IdGroup', e.currentTarget.attributes.idgroup.value);
    FlowRouter.go('AddItemsToOrder');
  },
  'click #StatusEventID' : function(e, i){
    if (e.currentTarget.attributes.status.value == 'delivering'){
      e.currentTarget.classList.add('disabled');
    }else{
      Meteor.Status.CheckStatus(e.currentTarget.attributes.idevent.value, e.currentTarget.attributes.idgroup.value, e.currentTarget.attributes.status.value);
    }
	}
});

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import '../events.js';
import '../../orders/orders.js';

Meteor.methods({
  CreateEvent: function(name, id){
    check(name, String);
    check(id, String);
    let info = {
      GroupId: id,
      createUser: Meteor.userId(), 
      dateCreate: new Date(),
      eventName: name,
      accepts: [Meteor.userId()],
      status: 'ordering'
    }
    Events.insert( info ); 
  },      
  RemoveEvent: function(id){
    check(id, String);
    Events.remove({'_id': id});
    Orders.remove({'EventId': id});
  },
  JoinToEvent: function(idEvent){
    check(idEvent, String);
    Events.update({'_id': idEvent}, {$push: {'accepts': Meteor.userId()}});
  },
  ChangeStatusEvent: function(idEvent, status){
    check(idEvent, String);
    check(status, String);
    Events.update({'_id': idEvent}, {$set: {'status': status}});
  },
  ResetEvent: function(idEvent){
    check(idEvent, String);
    Orders.remove({'EventId': idEvent});
    Events.update({'_id': idEvent}, {$set: {'status': 'ordering'}});
  }
});
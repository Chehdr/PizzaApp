import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

import './AddItemsToOrder.html';
import '../../api/groups/groups.js';
import '../../api/orders/orders.js';

Template.AddItemsToOrder.events({
    'submit form' : function(e, i){
      e.preventDefault();
      let order = {'userId': Meteor.userId(), 'email': Meteor.user().emails[0].address, 'order':[]};
      for(let i=0; i < e.target.length; i++){
          if (e.target[i].id == 'field1' ){
            if(e.target[i].checked == true && e.target[i+1].value > 0){
              order.order.push({
                'name': e.target[i].value, 
                'count': parseInt(e.target[i+1].value), 
                'price': parseFloat(e.target[i].attributes.price.value)
                });
            }
          }
      }
      if(order.order.length > 0){
          Meteor.call('AddOrderToEvent', Session.get('IdGroup'), Session.get('IdEvent'), order);
          FlowRouter.go('Event');
      }else{
          Meteor.Errors.alertError('OrderError'); 
      }
  }
});

Template.AddItemsToOrder.onCreated(function () {
  Meteor.subscribe('Groups');
  Meteor.subscribe('Orders');
});

Template.AddItemsToOrder.helpers({
  Order: function(){
     return Groups.findOne({'_id': Session.get('IdGroup')});

  },
  ifOrdered: function(){
    let ordered = Orders.findOne({ $and: [{"EventId" : Session.get('IdEvent')}, {"userId" : Meteor.userId()}]});
    if (Session.get('IdEvent')){
      if (ordered){
        return false
      }else{
        return true
      }
    }else{
      FlowRouter.go('Event');
    }
  }
});
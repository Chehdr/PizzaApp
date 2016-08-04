import './AddItemsToOrder.html';
import '../../api/groups/groups.js';
import '../../api/orders/methods.js';

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
          Meteor.call('AddOrderToEvent', Session.get('IdGroup'), Session.get('EventName'), order);
          FlowRouter.go('Event');
      }else{
          Meteor.Errors.alertError('OrderError'); 
      }
  }
});

Template.AddItemsToOrder.helpers({
  Order: function(){
    Meteor.subscribe('GroupsInfo');
    let order = GroupsInfo.findOne({'_id': Session.get('IdGroup')});
    Session.set('Order', order);
    return order

  },
  ifOrdered: function(){
    Meteor.subscribe('GroupsInfo');
    var group = Session.get('Order');
    if (group){
      for (let i = 0; i < group.events.length; i++) {
          if(group.events[i].eventName == Session.get('EventName')){
            for (let j = 0; j < group.events[i].orders.length; j++) {
                if(group.events[i].orders[j].userId == Meteor.userId()){
                  return false
                }
            }
          }
        }      
    }else{
      FlowRouter.go('Event');
    }
      return true
    }
});
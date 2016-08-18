import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import '../sendorders.js';
import '../orders.js';
import '../../groups/groups.js';
import '../../events/events.js';
import './EmailTemplate.handlebars';

Meteor.methods({
  AddOrderToEvent: function(groupId, eventId, order){
    check(groupId, String);
    check(eventId, String);
    order.GroupId = groupId;
    order.EventId = eventId;
    Orders.insert( order );
    let Limit = Orders.find( { 'EventId': eventId}).fetch();
    let Event = Events.findOne( { '_id': eventId});
    for (let i in Limit) {
      if (Limit[i].EventId == eventId){
        if(Event.accepts.length == Limit.length){
          Meteor.Status.CheckStatus(eventId, groupId, Event.status);
         break 
        }
      }
    }
  },
  SendOrder: function(idEvent, idGroup){
    //об'єднав все під один метод, трохи каша але я не знаю, як його ще спростити
    check(idEvent, String);
    check(idGroup, String);
    let AdminEvent = Events.findOne({'_id': idEvent}).createUser;
    let info = Groups.findOne({'_id': idGroup});
    let coupons = info.coupons;
    let orders = Orders.find({'EventId': idEvent}).fetch();
    let summ = 0;   
    let TogetherOrder = Orders.aggregate([{ $match: {EventId: idEvent}},
      { "$unwind": "$order" },
        { "$group": { 
          "_id": "$order.name",
          "name": { "$first": "$order.name" },
          "price": { "$first": "$order.price" },
          "totalqty": { "$sum": "$order.count" }
        }}
    ]);   
    for (let i = 0; i < coupons.length; i++) {
      for (let j = 0; j < TogetherOrder.length; j++) {
        if(coupons[i].name == TogetherOrder[j].name){
          TogetherOrder[j].price = Math.round(((TogetherOrder[j].totalqty - coupons[i].count)/ together[j].totalqty ) * together[j].price);
          if(TogetherOrder[i].price < 0){TogetherOrder[i].price = 0}
        }
      }
    }
    let NewPrice = TogetherOrder;
    for (let i = 0; i < NewPrice.length; i++) {
      for (let j = 0; j < orders.length; j++) {
        orders[j].summ = 0;
        for (let k = 0; k < orders[j].order.length; k++) {
          if(NewPrice[i].name == orders[j].order[k].name){
            orders[j].order[k].price = NewPrice[i].price;
          }
          orders[j].summ += Math.round((orders[j].order[k].price * orders[j].order[k].count)*100)/100;
        }
      }
    }
    let OrderForUserAndSumm = orders;
    NewPrice.summ = 0;
    for (let i = 0; i < OrderForUserAndSumm.length; i++) {
      NewPrice.summ += OrderForUserAndSumm[i].summ;
    }
    let TogetherOrderAndSumm = NewPrice;
    for(let i in OrderForUserAndSumm){
      if (AdminEvent == OrderForUserAndSumm[i].userId){
        OrderForUserAndSumm[i].totalorders = TogetherOrderAndSumm;
      }
    let options = {
      from: 'PizzaDayRobot@gmail.com',
      to: OrderForUserAndSumm[i].email,
      subject: 'Hello from Pizza Day!',
      html: Handlebars.templates['EmailTemplate']({'orders': OrderForUserAndSumm[i], 'totalsumm':  Math.round(TogetherOrderAndSumm.summ*100)/100})
    }
    Email.send(options);
    }
  }  
});

/*Meteor.Order = {
  Together: function(idEvent, idGroup){
    return Orders.aggregate([{ $match: {EventId: idEvent}},
      { "$unwind": "$order" },
        { "$group": { 
          "_id": "$order.name",
          "name": { "$first": "$order.name" },
          "price": { "$first": "$order.price" },
          "totalqty": { "$sum": "$order.count" }
        }}
    ]);
  },
  NewPrice: function(id, together){
    let info = Groups.findOne({'_id': id});
    let coupons = info.coupons;
    for (let i = 0; i < coupons.length; i++) {
      for (let j = 0; j < together.length; j++) {
        if(coupons[i].name == together[j].name){
          together[j].price = Math.round(((together[j].totalqty - coupons[i].count)/ together[j].totalqty ) * together[j].price);
          if(together[i].price < 0){together[i].price = 0}
        }
      }
    }
    return together
  },
  OrderForUserAndSumm: function(id, NewPrice){
    let orders = Orders.find({'EventId':id}).fetch();
    let summ = 0;
    for (let i = 0; i < NewPrice.length; i++) {
      for (let j = 0; j < orders.length; j++) {
        orders[j].summ = 0;
        for (let k = 0; k < orders[j].order.length; k++) {
          if(NewPrice[i].name == orders[j].order[k].name){
            orders[j].order[k].price = NewPrice[i].price;
          }
          orders[j].summ += Math.round((orders[j].order[k].price * orders[j].order[k].count)*100)/100;
        }
      }
    }
    return orders
  },
  TogetherOrderAndSumm: function(together, usersumm){
    together.summ = 0;
    for (let i = 0; i < usersumm.length; i++) {
      together.summ += usersumm[i].summ;
    }
    return together
  }
};
*/
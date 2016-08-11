import { Meteor } from 'meteor/meteor';

import '../sendorders.js';
import './EmailTemplate.handlebars';
    Meteor.methods({
        AddOrderToEvent: function(groupId, eventId, order){
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
            let AdminEvent = Events.findOne({'_id': idEvent}).createUser;
            let TogetherOrder = Meteor.Order.Together(idEvent);
            let NewPrice = Meteor.Order.NewPrice(idGroup, TogetherOrder);
            let OrderForUserAndSumm = Meteor.Order.OrderForUserAndSumm(idEvent, NewPrice);
            let TogetherOrderAndSumm = Meteor.Order.TogetherOrderAndSumm(NewPrice, OrderForUserAndSumm);

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

Meteor.Order = {
    Together: function(idEvent, idGroup){
        return Orders.aggregate([
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
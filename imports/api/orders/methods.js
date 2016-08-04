import React from 'react';
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { GetContactEmail } from './email-template'; 

Meteor.Order = {
    CheckStatus: function (name, status, orders, id) {
       	switch(status){
            case 'ordering' : Meteor.Order.SendOrders(orders, id);  status = 'ordered'; break
            case 'ordered' : status = 'delivering'; break
            case 'delivering' : status = 'delivered'; break
            case 'delivered' : status = 'ordering'; break
        }
        Meteor.call('ChangeStatusGroup', name, status);
	},
	SendOrders: function (orders, id){
    	let Info = GroupsInfo.findOne({_id: id});
    	let [coup, AdminEvent, AllOrders, AllSumm] = [Info.coupons, Info.AdminGroup, Info.menu, 0]
    	for (let i = 0; i < coup.length; i++) {
    		coup[i].prices = 0; coup[i].price = 0; coup[i].items = 0;
				for (let j = 0; j < orders.length; j++) {
		   			for (let k = 0; k < orders[j].order.length; k++) {
		   				if (coup[i].name == orders[j].order[k].name){
		   					coup[i].prices += orders[j].order[k].price * orders[j].order[k].count;
		   					coup[i].price = orders[j].order[k].price;
		   					coup[i].items += orders[j].order[k].count;
		   				}
		   			}
				}
			coup[i].item = ((coup[i].items - coup[i].count) * coup[i].price)/coup[i].items;
    	} // New price for itemes with coupons
   		for (let i = 0; i < orders.length; i++) {
        	orders[i].together = 0;
        		for (let j = 0; j < orders[i].order.length; j++) {
          				for (let k = 0; k < coup.length; k++) {
               			if (orders[i].order[j].name == coup[k].name){
                   			orders[i].order[j].price = Math.round(coup[k].item * orders[i].order[j].count*100)/100;
                   			if(orders[i].order[j].price < 0){orders[i].order[j].price = 0}
               			}
           			}
           		orders[i].together += orders[i].order[j].price * orders[i].order[j].count;
           		for(let y = 0; y < AllOrders.length; y++){
		   			if(AllOrders[y].name == orders[i].order[j].name){
		   				if(!AllOrders[y].count){AllOrders[y].count = 0;}
		   				AllOrders[y].count +=  orders[i].order[j].count;
		   			}
		   		} 
        	}
        	AllSumm += orders[i].together;
    	} // All orders together and summ for user
		for(let i in orders){
			if (AdminEvent == orders[i].userId){
				orders[i].AllOrders = AllOrders;
			}
			orders[i].AllSumm = Math.round(AllSumm*100)/100;
			orders[i].together = Math.round(orders[i].together*100)/100;
			let options = {
				from: 'PizzaDayRobot@gmail.com',
				to: orders[i].email,
				subject: 'Hello from Pizza Day!',
				html: GetContactEmail(orders[i])
			}
			Meteor.call("SendEmail", options);
		}
	}	
};
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './Menu.html';
import '../../api/groups/groups.js';

Template.Menu.helpers({
	MenuItems: function(){
    Meteor.subscribe('Groups');
    if(Roles.userIsInRole(Meteor.userId(), 'admin')){
      return Groups.findOne({'AdminGroup': Meteor.userId()});
    }else{
      return Groups.findOne( { 'users': { $in: [Meteor.userId() ] } } )
    }        
  }
});

Template.Menu.events({
	'click #AddItemID' : function(e, i){
    Blaze.render(Template.AddRow, MenuTableID);
	},
 	'click #DeleteItemID' : function(e, i){
   	TableForMenu.deleteRow(-1);
 	},
 	'submit form' : function(e, i){
   	e.preventDefault();
   	let menu = [];
   	for(let i=0; i < e.target.length; i++){
   		if (e.target[i].id == 'field1' ){
     		if(e.target[i].value && e.target[i+1].value){
     			menu[menu.length] = {name: e.target[i].value, price: parseFloat(e.target[i+1].value)}
     		}else{
     			Meteor.Errors.alertError('MenuError'); return
     		}
   		}
   	}
   	Meteor.call('GroupMenu', menu);
    let DeleteColumn = document.getElementsByClassName('NeedDelete');
    for (i in DeleteColumn) {
      DeleteColumn[0].outerHTML = '';
    }
  }
});
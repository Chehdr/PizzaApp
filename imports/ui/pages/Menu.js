import './Menu.html';
import '../../api/groups/groups.js';

Template.Menu.helpers({
	MenuItems: function(){
        Meteor.subscribe('GroupsInfo');
        if(Roles.userIsInRole(Meteor.userId(), 'admin')){
            return GroupsInfo.findOne({'AdminGroup': Meteor.userId()});
        }else{
            return GroupsInfo.findOne( { 'users': { $in: [Meteor.userId() ] } } )
        }        
    }
});

Template.Menu.events({
	'click #AddItemID' : function(e, i){
    	let row = TableForMenu.insertRow(-1);
    	row.className = 'NeedDelete';
    	let cell1 = row.insertCell(0);
    	let cell2 = row.insertCell(0);
    	cell1.innerHTML = "<div class=\"col-xs-3\"><input class=\"form-control \" id=\"field2\" type=\"text\"></div>"; 
    	cell2.innerHTML = "<input type=\"text\" class=\"form-control\" id=\"field1\">";
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
    	if($('.NeedDelete').length !== 0){
      		while( $('.NeedDelete').length > 0) {
        		$('.NeedDelete')[0].remove();
      		}
    	}
  	}
});
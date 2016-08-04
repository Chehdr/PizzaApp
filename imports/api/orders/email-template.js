import React from 'react';
import { Box, Email, Item, Span, renderEmail } from 'react-html-email';

const css = `
@media only screen and (max-device-width: 480px) {
  font-size: 20px !important;
}
table {
	width:600px;
	margin:0 auto;
	background:#FFF;line-height: 30px;
}
`.trim();

const ContactMeTemplate = function(props) { 

  return <Email title="Pizza Day" headCSS={css}>
		<center>
            <Box>
              <Item>
				  <center><h2>Pizza Day check!</h2></center>
				  <center><p>Thenks for using Pizza Day App</p></center>
				     <tr>
				       <th>Item name</th>
				       <th>Count</th>
				      <th>Price</th>
				    </tr>
				  {props.name.order.map(function (order) {
				    return (
				    <tr>
				      <td>{order.name}</td>
				      <td>{order.count}</td>
				      <td>{order.price}</td>
				     </tr>
				    )
				  })}
				    <tr>
        				<th>To pay:</th>
        				<td>{props.name.together}</td>
      				</tr>
      				<br>
      				</br>
      				{props.name.AllOrders ? 
      					props.name.AllOrders.map(function (AllOrders) {
						    return (
						    <tr>
						      <td>{AllOrders.name}</td>
						      <td>{AllOrders.count}</td>
						      <td>{AllOrders.price}</td>
						     </tr>
						    )
						  }) : ''}
					<tr>
        				<th>Total:</th>
        				<td>{props.name.AllSumm}</td>
      				</tr>

              </Item>
            </Box>
        </center>
        </Email>;
};



export const GetContactEmail = function(name){
  return renderEmail(<ContactMeTemplate name = {name} />);
}
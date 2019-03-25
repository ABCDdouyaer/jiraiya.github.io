import React from 'react';
import Animal from '../common/animal';


function Dog(props){

    return(
        <h1>{props.target}</h1>
    )
}

class Display extends React.Component{

   
   render(){
       return(
            <Animal render={data=>(
                <Dog target={data.target} />
            )} />
       )
   }
}

export default Display;
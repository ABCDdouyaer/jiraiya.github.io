import React from 'react';

class Animal extends React.Component{
    constructor(props){
        super(props);
        this.state = {target: 'cat'}
    }

    render(){
        return(
            <div>
                {this.props.render(this.state)}
            </div>
        )
    }
}

export default Animal;
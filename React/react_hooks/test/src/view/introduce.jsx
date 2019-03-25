import Data from '../common/data';
import React from 'react';

function introduce(props){
    return(
        <div>
            <p>{props.name}</p>
            <p>{props.sex}</p>
        </div>
    )
}

export default Data(introduce);
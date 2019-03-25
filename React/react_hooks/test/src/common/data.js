import React from 'react';

function Data(MyC){
    let [name, sex] = ['xiaoming', 'man'];
    return () => <MyC name={name} sex={sex} />
}

export default Data;
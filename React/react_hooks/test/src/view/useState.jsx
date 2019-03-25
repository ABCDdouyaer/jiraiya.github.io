import React,{useState} from 'react';

function Example(){
    const [count, setCount] = useState(1);
    const [fruits, setFruits] = useState('banner');
    
    function change(){
      fruits === 'banner' ? setFruits('apple') : setFruits('banner')
    }
    
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={()=>setCount(count + 1)}>Click me</button>

            <h1 onClick={change}>{fruits}</h1>
        </div>
    )
}

export default Example;
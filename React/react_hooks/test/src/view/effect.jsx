import React,{useState, useEffect} from 'react';
import './effect.css';

function Example(){
    let start = new Date().toLocaleString();
    const [count, setCount] = useState(1);
    const [count1, setCount1] = useState(2);
    const [time, setTime] = useState(start);
    const [n, setN] =  useState(1);

    useEffect(()=>{
        let dom = document.querySelector('.section');
        dom.addEventListener('mousemove',fn ,false);
        return ()=>{
            dom.removeEventListener('mousemove', fn)
         }
    })
    
    useEffect(()=>{
        let dom = document.querySelector('.section1');
        dom.addEventListener('mousemove',fn1 ,false);
        return ()=>{
            dom.removeEventListener('mousemove', fn1)
         }
    },[])//加[]参数只会执行一次

    if(count>40){
        useEffect(()=>{
            setTime(new Date().toLocaleString());
        })
    }

    function fn(){
        setCount(count + 1);
    }

    function fn1(){
        setCount1(count1 + 1);
    }
    
    return (
        <>
            <h3>时间：{time} <span>注意：当count>40的时候启动时钟</span></h3>
            <p>count:{count} </p>
            <div className='section'>该区域会一直执行</div>
            <p>count1: {count1}</p>
            <div className='section1'>该区域只会执行一次</div>
            <div>
               <input type="button" value='-' onClick={()=>setN(pre=>pre-1)}/>
               <span>{n}</span>
               <input type="button" value='+' onClick={()=>setN(pre=>pre+1)}/>
               <input type="reset" value='重置' onClick={()=>setN(0)}/>
            </div>
        </>
    )
}

export default Example;
import axios from 'axios';
import { useContext } from 'react';
import { useEffect } from 'react';
import { createContext, useState } from 'react'
import React from 'react'

const DataContext = createContext();

export function DataContextProvider({children}){
    const [data, setData] = useState([])

    useEffect(() => {
        async function fetchData(){
            try{
            const data = await axios.get(
                'http://192.168.1.64:5000/teste'
            )
            setData(data)
            }catch(e){
                console.log(e)
            }
        }
        fetchData()
    }, [])
    
    return(
        <DataContext.Provider value={data}>
            {children}
        </DataContext.Provider>
    )
}

export function useAPI(){
    const context = useContext(DataContext)
    if(context == undefined){
        throw new Error("Context undefined")
    }
    return context
}
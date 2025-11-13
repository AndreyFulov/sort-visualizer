import { useEffect, useState } from 'react'
import methods from './methods.json' with {type: 'json'}

interface Method {
    name: string,
    description: string,
}
export default function AboutMethod({selectedMethod}: {selectedMethod:string}) {
    const Methods: Method[] = methods;
    const [currentMethod, setCurrentMethod] = useState<Method>(Methods[0]);
    useEffect(()=>{
        for(let i = 0; i < methods.length; i++) {
            if(methods[i].name === selectedMethod) {
                setCurrentMethod(methods[i])
            }
        }
    }, [selectedMethod])
    return(
        <div>
            {currentMethod.description}
        </div>
    )
}
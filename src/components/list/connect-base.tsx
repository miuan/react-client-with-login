import React, { useState, useEffect } from "react";
import { DropdownButton, Dropdown, Form } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { getDataFromRaw } from "../../components/editor/edit";

export const ConnectBase: React.FC<{value:any, names?:any, gql: any, item: any}> = ({value, names, gql, item}) => {
    const element = value
    const name = names.length>1 && names[1]
    const elementTitle = element.push && element.reduce && names.length > 1 ? (element as any[]).reduce((p, e)=>p + `, ${e[name]}`, '').substr(2) : element
  
    const [title, setTitle] = useState(elementTitle)
    const [data, setData] = useState<any[]>([])
  
    const { refetch: userRefetch, loading: userLoading } = useQuery(gql.QUERY, {
      onError: (e) => {
        console.log('ConnectBase:onError >>> ', e.message)
        if(e.message == 'GraphQL error: Unauhorized'){
          // setUnauthorized(true)
        } else {
          // setError(e)
        }
      }, onCompleted: (iraw) => {
        console.log('user: onCompleted', iraw)
        // setLoading(false)
  
        const dataFields = Object.getOwnPropertyNames(iraw)
        if(dataFields.length > 0 && iraw[dataFields[0]].length > 0){
          const raw = iraw[dataFields[0]]
  
          const final = raw.map((r:any)=>{
            return {
              id: r.id,
              checked: title.indexOf(r[name]) !== -1,
              label: r[name]
            }
          })
  
          setData(final)
        } else {
          setData([])
        }
        
      },
    });
  
    const [
      addMutation,
      { loading: addMutaionLoading, data: addMutationData, error: addMutationError }
    ] = useMutation(gql.ADD, {
      errorPolicy: "none",
      onCompleted: (raw: any) => {
        const data = getDataFromRaw(raw)
        console.log("ADDED", raw, data.id);
      },
      onError: () => {}
    });
  
    const [
      removeMutation,
      { loading: removeMutaionLoading, data: removeMutationData, error: removeMutationError }
    ] = useMutation(gql.REMOVE, {
      errorPolicy: "none",
      onCompleted: (raw: any) => {
        const data = getDataFromRaw(raw)
        console.log("REMOVE", raw, data.id);
      },
      onError: () => {}
    });
  
    const onChecked = (value:any) => {
      const updated = data.map((d:any)=>{
        if(d.label === value.label) {
          d.checked = !d.checked
        }
        return {...d}
      })
  
      const updateTitle = (updated as any[]).reduce((p, e) => {
        if(e.checked) return `${p}, ${e.label}`
        else return p
      }, '').substr(1)
  
      console.log('onChecked:', {updated, value, updateTitle})
  
      if(value.checked){
        addMutation({
          variables: {
            id1: value.id,
            id2: item.id
          }
        });
      } else {
        removeMutation({
          variables: {
            id1: value.id,
            id2: item.id
          }
        });
      }
      
  
      setData(updated)
      setTitle(updateTitle)
    }
    
    // if(element.push && element.reduce && names.length > 1) {
    //   return (<>ahoj: {(element as any[]).reduce((p, e)=>p + e[names[1]], '')}</>)
    // }
  
    return (<DropdownButton id="dropdown-basic-button" title={title}>
        {data && data.map((d:any)=>(
        <Dropdown.Item  onClick={(e:any) => onChecked(d)} >
          <Form.Check 
              type="checkbox" 
              label={d.label} 
              checked={d.checked} />
        </Dropdown.Item>))
        }
      </DropdownButton>)
  }

  export default ConnectBase
import React, { useState, useEffect, useCallback } from "react";

import { BaseForm, IProjectModel } from "./form";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { DEFAULT_SCHEMA } from "../../pages/projects/defaultSchema";
import * as _ from 'lodash'
import { Alert } from 'react-bootstrap'
import Unauthorized from '../common/unauthorized'
import Loading from '../common/loading'

export const getDataFromRaw = (rawData: any) => {
  const rawName = Object.keys(rawData)[0]
  return rawData[rawName]
}

export const BaseEdit = ({id: externId, query, name, fields}:any) => {
  

  const [localId, setLocalId] = useState(externId);
  const [unauthorized, setUnauthorized] = useState(false);

  const [model, setModel] = useState({
    name: "project A",
    schema: DEFAULT_SCHEMA
  });

  const { loading, error } = useQuery(query.QUERY, {
    variables: {id: externId},
    skip: !externId,
    onCompleted: (loadedDataRaw: any) =>{
      
      const loadedData = getDataFromRaw(loadedDataRaw)
      
      console.log('Edit:QUERY', {externId, loadedDataRaw, loadedData})

      if(loadedData){
        const np = fields.reduce((o:any, field:string)=> {
          o[field] = loadedData[field]
          return o
        }, {})

        setModel(np)
      } else {
        setUnauthorized(true)
      }
    }, onError: (e) => {
      console.log('onError >>> ', e.message)
      if(e.message == 'GraphQL error: Unauhorized'){
        setUnauthorized(true)
      }
      setModel({name:'', schema: ''})
    }
  });

  const [
    createProjectMutation,
    { loading: createLoading, data: createData, error: createError }
  ] = useMutation(query.CREATE_MUTATION, {
    errorPolicy: "none",
    onCompleted: (raw: any) => {
      const data = getDataFromRaw(raw)
      console.log("CREATED", raw, data.id);
      setLocalId(data.id);
    },
    onError: () => {}
  });

  const [updateProjectMutation, { loading:updateLoading, data: updateData, error:updateError }] = useMutation(
    query.UPDATE_MUTATION,
    {
      errorPolicy: "none",
      onCompleted: (data: any) => {
        console.log("UPDATED", data.updateProject.id);
        setLocalId(data.createProject.id);
      },
      onError: () => {}
    }
  );

  const onUpdate = useCallback((model: any) => {
    console.log('onUpdate >>> ', localId, model)
    if(localId){
        updateProjectMutation({
            variables: {
              id:localId,
              ...model
            }
          });
    } else {
        createProjectMutation({
            variables: {
              userId: localStorage.getItem("user.id"),
              ...model
            }
          });
    }
    
  }, [localId]);

  if(unauthorized) {
    return (<Unauthorized where={`${name} edit`} />)
  }

  if(loading) {
    return (<Loading what={name}/>)
  }

  return (
    <div>
      <h1>{name} Edit ({externId})</h1>
      {error && <Alert variant={'danger'}>`${error.message}`</Alert>}
      <BaseForm model={model} doUpdate={onUpdate} edit={Boolean(localId)} fields={fields} />
    </div>
  );
};

export default BaseEdit
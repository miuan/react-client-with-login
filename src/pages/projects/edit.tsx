import React, { useState, useEffect, useCallback } from "react";

import { ProjectForm, IProjectModel } from "./form";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { DEFAULT_SCHEMA } from "./defaultSchema";
import * as _ from 'lodash'
import { Alert } from 'react-bootstrap'
import Unauthorized from '../../components/common/unauthorized'
import Loading from '../../components/common/loading'

const CREATE_PROJECT_MUTATION = gql`
  mutation createProject($userId: ID!, $name: String!, $schema: String!) {
    createProject(userId: $userId, name: $name, models: $schema) {
      id
      name
      models
    }
  }
`;

const UPDATE_PROJECT_MUTATION = gql`
  mutation updateProject($id: ID!, $name: String!, $schema: String!) {
    updateProject(id: $id, name: $name, models: $schema) {
      id
      name
      models
    }
  }
`;

const PROJECT_QUERY = gql`
  query project($projectId:ID){ Project(id:$projectId) {
      id,
      name,
      models
    }}
`;

export const ProjectEdit = (data:any) => {
  const projectId = _.get(data, 'match.params.projectId')
  console.log('data >>> ', data)

  const [id, setId] = useState(projectId);
  const [unauthorized, setUnauthorized] = useState(false);

  const [model, setModel] = useState({
    name: "project A",
    schema: DEFAULT_SCHEMA
  });

  const { loading, error } = useQuery(PROJECT_QUERY, {
    variables: {projectId},
    skip: !_.get(data, 'match.params.projectId'),
    onCompleted: (project: any) =>{
      const p = project.Project
      console.log('PROJECT_QUERY', p)
      setModel({
        name: p.name,
        schema: p.models
      })
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
  ] = useMutation(CREATE_PROJECT_MUTATION, {
    errorPolicy: "none",
    onCompleted: (data: any) => {
      console.log("CREATED", data.createProject.id);
      setId(data.createProject.id);
    },
    onError: () => {}
  });

  const [updateProjectMutation, { loading:updateLoading, data: updateData, error:updateError }] = useMutation(
    UPDATE_PROJECT_MUTATION,
    {
      errorPolicy: "none",
      onCompleted: (data: any) => {
        console.log("UPDATED", data.updateProject.id);
        setId(data.createProject.id);
      },
      onError: () => {}
    }
  );

  const onUpdate = useCallback((model: IProjectModel) => {
    console.log('onUpdate >>> ', id)
    if(id){
        updateProjectMutation({
            variables: {
              id,
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
    
  }, [id]);

  if(unauthorized) {
    return (<Unauthorized where={'project edit'} />)
  }

  if(loading) {
    return (<Loading what={'project'}/>)
  }

  return (
    <div>
      <h1>Project Edit ({projectId})</h1>
      {error && <Alert variant={'danger'}>`${error.message}`</Alert>}
      <ProjectForm model={model} doUpdate={onUpdate} edit={Boolean(id)} />
    </div>
  );
};

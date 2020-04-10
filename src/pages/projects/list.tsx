import React, { useState, useEffect } from "react";
import FilteredList from "../../components/list/filtered-list";
import gql from 'graphql-tag';

const USER_LIST_QUERY = gql`
  query allProjects($filter: ProjectFilter){ allProjects(filter: $filter) {
      id
      name,
      models
    }}
`;

const ADMIN_LIST_QUERY = gql`
  query allProjects($filter: ProjectFilter){ allProjects(filter: $filter) {
      id
      name,
      models,
      user {
          id,
          email
      }
    }}
`;

const DELETE_MUTATION = gql`
  mutation deleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`;


export const ProjectList: React.FC<{userId?: string, adminMode?: boolean}> = ({userId, adminMode=false}) => {
    return (
        <div>
            <FilteredList 
                name={'Projects'}
                fields={['name','id','models']}
                userId={userId} 
                adminMode={adminMode}
                queries={{USER_LIST_QUERY, ADMIN_LIST_QUERY, DELETE_MUTATION}} />
        </div>
    )
}

export default ProjectList
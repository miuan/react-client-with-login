import React from "react";
import FilteredList from "../../components/list/filtered-list";
import gql from 'graphql-tag';
import ConnectBase from "../../components/list/connect-base";

const USER_LIST_QUERY = gql`
  query allUsers($filter: UserFilter){ allUsers(filter: $filter) {
      id
      name,
      models
    }}
`;

const ADMIN_LIST_QUERY = gql`
  query allUsers($filter: UserFilter){ allUsers(filter: $filter) {
      id
      email,
      password,
      roles {
        id
        role
      }
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const USER_ROLE_QUERY = gql`
  query allUserRoles{ allUserRoles {
      id
      role
    }}
`;

const ADD_MUTATION = gql`
  mutation addToRoleOnUser($id1: ID!, $id2: ID!) { addToRoleOnUser(rolesUserRoleId:$id1, usersUserId:$id2) {
    rolesUserRole {
      id
    } usersUser {
      id
    }
  }}
`;

const REMOVE_MUTATION = gql`
  mutation removeFromRoleOnUser($id1: ID!, $id2: ID!) { removeFromRoleOnUser(rolesUserRoleId:$id1, usersUserId:$id2) {
    rolesUserRole {
      id
    } usersUser {
      id
    }
  }}
`;


const ConnectRole: React.FC<{value:any, names?:any, item:any}> = ({value,names, item}) => {
 

  const gql = {
    QUERY: USER_ROLE_QUERY,
    ADD: ADD_MUTATION,
    REMOVE: REMOVE_MUTATION
  }

  return <ConnectBase value={value} names={names} gql={gql} item={item}/>
}

export const UserList: React.FC<{userId?: string, adminMode?: boolean}> = ({userId, adminMode=false}) => {
    return (
        <div>
            <FilteredList 
                name={'Users'}
                fields={['email','password', {name: 'roles.role', component: ConnectRole}, 'roles.id']}
                userId={userId} 
                adminMode={adminMode}
                queries={{USER_LIST_QUERY, ADMIN_LIST_QUERY, DELETE_MUTATION}} />
        </div>
    )
}

export default UserList
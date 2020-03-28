import React from 'react'


export interface User {
    id: string,
    token: string,
    email: string,
    roles: string[]
}

const userToStorage = (user: User) => {
    localStorage.setItem('user.token', user.token)
    localStorage.setItem('user.id', user.id)
    localStorage.setItem('user.email', user.email)
    localStorage.setItem('user.roles', user.roles.join(';'))
}

const removeUserFromStorage = () => {
  localStorage.removeItem('user.token')
  localStorage.removeItem('user.id')
  // localStorage.removeItem('user.email')
  localStorage.removeItem('user.roles')
}

const userFromStorage = () => {
    const token = localStorage.getItem('user.token')
    if(!token) {
        return {}
    }

    return {
        token,
        email: localStorage.getItem('user.email'),
        id: localStorage.getItem('user.id'),
        roles: localStorage.getItem('user.roles')?.split(';'),
    }
}

// https://kentcdodds.com/blog/how-to-use-react-context-effectively
const UserStateContext = React.createContext<any | null>(null)
const UserDispatchContext = React.createContext<any | null>(null)

const USER_INIT = 'USER_INIT'
const USER_LOGIN = 'USER_LOGIN'
const USER_LOGOUT = 'USER_LOGOUT'

const userReducer = (state: any, action: any) => {
  switch (action.type) {
    case USER_INIT: {
      return userFromStorage()
    }
    case USER_LOGIN: {
      userToStorage(action.user)
      return {
        id: action.user.id,
        token: action.user.token,
        email: action.user.email,
        roles: action.user.roles,
      } as User
    }
    case USER_LOGOUT: {
      removeUserFromStorage()
      return {}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function UserProvider({children}: any) {
  const [state, dispatch] = React.useReducer(userReducer, userFromStorage())
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  )
}

function useUserState() {
  const context = React.useContext(UserStateContext)
  if (context === undefined) {
    throw new Error('useCountState must be used within a UserProvider')
  }
  return context
}

function useUserDispatch() {
  const context = React.useContext(UserDispatchContext)
  if (context === undefined) {
    throw new Error('useCountDispatch must be used within a UserProvider')
  }
  return context
}

export { UserProvider, useUserState, useUserDispatch, USER_INIT, USER_LOGIN, USER_LOGOUT }
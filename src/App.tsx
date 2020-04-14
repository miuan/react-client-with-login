import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';

import { ProjectEdit } from './pages/projects/edit'
import { ProjectList } from './pages/projects/list'
import UserList from "./pages/users/list";
import { Header } from './components/header/header'
import { UserProvider } from './contexts/userContext'

import apolloClient from './common/apolloClient'
import UserRoleList from "./pages/user-roles/list";
import UserRoleEdit from './pages/user-roles/edit'


// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

export default function BasicExample() {

  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <Router>
          <div>
              <Header />
            {/*
              A <Switch> looks through all its children <Route>
              elements and renders the first one whose path
              matches the current URL. Use a <Switch> any time
              you have multiple routes, but you want only one
              of them to render at a time
            */}
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/dashboard">
                <Dashboard />
              </Route>
              <Route path="/user/projects/create" component={ProjectEdit} />
              <Route path="/user/projects/:projectId" component={ProjectEdit} />
              <Route path="/user/projects">
                <ProjectList userId={localStorage.getItem('user.id') || ''}/>
              </Route>
              <Route path="/admin/projects">
                <ProjectList adminMode={true}/>
              </Route>
              <Route path="/admin/users">
                <UserList adminMode={true}/>
              </Route>
              <Route path="/admin/roles">
                <UserRoleList adminMode={true}/>
              </Route>
              <Route path="/user/roles/create" component={UserRoleEdit} />
              <Route path="/user/roles/:id" component={UserRoleEdit} />
            </Switch>
          </div>
        </Router>
      </UserProvider>
    </ApolloProvider>
  );
}

// You can think of these components as "pages"
// in your app.

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}


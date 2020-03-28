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
import { Header } from './components/header/header'
import { UserProvider } from './contexts/userContext'

import apolloClient from './common/apolloClient'

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
              <Route path="/project-create" component={ProjectEdit} />
              <Route path="/project/:projectId" component={ProjectEdit} />
              <Route path="/project-list">
                <ProjectList userId={localStorage.getItem('user.id') || ''}/>
              </Route>
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


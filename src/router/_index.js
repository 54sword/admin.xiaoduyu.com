import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch, Redirect } from 'react-router-dom'

import '../common/mobi.min.css'
import '../pages/global.scss'
import '../common/load-demand'

// pages
import Home from '../pages/home'
import Posts from '../pages/posts'
import PostsDetail from '../pages/posts-detail'
import Topics from '../pages/topics'
import FormTopic from '../pages/form-topic'
import SignIn from '../pages/sign-in'
import People from '../pages/people'
import Comment from '../pages/comment'
import Notification from '../pages/notification'
import NotFound from '../pages/not-found'

// components
import Head from '../components/head'
import Sidebar from '../components/sidebar'


// import CSSModules from 'react-css-modules'
// import styles from './style.scss'

let signIn = false

// 登录用户
function requireAuth(Layout, props) {
  if (!signIn) {
    return <Redirect to="/sign-in" />
  } else {
    return <Layout {...props} />
  }
}

// 游客
const requireTourists = (Layout, props) => {
  if (signIn) {
    return <Redirect to="/" />
  } else {
    return <Layout {...props} />
  }
}

// 普通
const triggerEnter = (Layout, props) => {
  return <Layout {...props} />
}


const routeArr = [
  { path: '/',               exact: true, component: Home,         head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/posts',          exact: true, component: Posts,        head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/posts/:id',      exact: true, component: PostsDetail,  head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/topics',         exact: true, component: Topics,       head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/add-topic',      exact: true, component: FormTopic,    head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/edit-topic/:id', exact: true, component: FormTopic,    head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/people',         exact: true, component: People,       head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/comment',        exact: true, component: Comment,      head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/notification',   exact: true, component: Notification, head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/sign-in',        exact: true, component: SignIn,                                     enter: requireTourists },
  { path: '**',                         component: NotFound,                                   enter: triggerEnter }
]

let router = ({ userinfo }) => {

  if (userinfo && userinfo._id) {
    signIn = true
  } else {
    signIn = false
  }

  let _router = (<div>

        <Switch>
          {routeArr.map((route, index) => (
            <Route key={index} path={route.path} exact={route.exact} component={route.head} />
          ))}
        </Switch>

        <div className="flex-center">
          <div className="container-fluid">
            <div className="flex-left flex-wrap units-gap-big top-gap">

              <Switch>
                {routeArr.map((route, index) => (
                  <Route key={index} path={route.path} exact={route.exact} component={route.sidebar} />
                ))}
              </Switch>

              {/* <div className="unit-0 hide-on-mobile" style={{width:'200px'}}>
                <Sidebar />
              </div> */}

              <div className="unit">
                <Switch>
                  {routeArr.map((route, index) => {
                    if (route.component) return <Route key={index} path={route.path} exact={route.exact} component={props => route.enter(route.component, props)} />
                  })}
                </Switch>
              </div>
            </div>
          </div>
        </div>

    </div>)

  return () => _router
}

export const RouteArr = routeArr
export const Router = router

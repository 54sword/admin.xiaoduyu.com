import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch, Redirect } from 'react-router-dom'
import Promise from 'promise'

import '../common/mobi.min.css'
import '../pages/global.scss'


// pages
import Home from '../pages/home'
import Posts from '../pages/posts'
import PostsDetail from '../pages/posts-detail'
import Topics from '../pages/topics'
import SignIn from '../pages/sign-in'
import NotFound from '../pages/not-found'

// components
import Head from '../components/head'

// actions
// import { update } from '../actions/account'

let signIn = false

// 登录验证
function requireAuth(Layout, props) {

  // console.log(props);
  if (!signIn) { // 未登录
    return <Redirect to="/sign-in" />
  } else {
    return <Layout {...props} />
  }
}

// console.log(SignIn.WrappedComponent.defaultProps.component);

const routeArr = [
  {
    path: '/',
    exact: true,
    component: props => requireAuth(Home, props),
    head: Head
  },
  {
    path: '/posts',
    exact: true,
    component: props => requireAuth(Posts, props),
    head: Head
  },
  {
    path: '/posts/:id',
    exact: true,
    component: props => requireAuth(PostsDetail, props),
    head: Head
  },
  {
    path: '/topics',
    exact: true,
    component: props => requireAuth(Topics, props),
    head: Head
  },
  {
    path: '/sign-in',
    exact: true,
    component: SignIn
  },
  {
    path: '**',
    component: NotFound
  }
]


let router = ({ userinfo }) => {

  // console.log('----');
  // console.log(userinfo);

  if (userinfo) {
    signIn = true
  }

  return () => (<div className="flex-center">
      <div className="container-wider">
        <div className="flex-left flex-wrap units-gap-big">

          <Switch className="unit-1-4 unit-1-on-mobile">
            {routeArr.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.head}
                />
            ))}
          </Switch>

          <Switch className="unit-3-4 unit-1-on-mobile">
            {routeArr.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.component}
                />
            ))}
          </Switch>

        </div>
      </div>
    </div>)
}

export const RouteArr = routeArr
export const Router = router

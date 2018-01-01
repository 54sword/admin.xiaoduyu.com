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
import SignIn from '../pages/sign-in'
import NotFound from '../pages/not-found'

// components
import Head from '../components/head'
import Sidebar from '../components/sidebar'


// import CSSModules from 'react-css-modules'
// import styles from './style.scss'

let signIn = false

// 登录验证
function requireAuth(Layout, props) {

  // console.log(signIn);

  if (!signIn) { // 未登录
    // console.log('未登录');
    return <Redirect to="/sign-in" />
  } else {
    return <Layout {...props} />
  }
}

// 进入路由
const triggerEnter = (Layout, props) => {

  // console.log(signIn);

  if (signIn) { // 未登录
    // console.log('12313');
    return <Redirect to="/" />
  } else {
    return <Layout {...props} />
  }
}

/*
const routeArr = [
  { path: '/', exact: true, component: props => requireAuth(Home, props), head: Head, sidebar: Sidebar, center: requireAuth },
  { path: '/posts', exact: true, component: props => requireAuth(Posts, props), head: Head, sidebar: Sidebar, center: requireAuth },
  { path: '/posts/:id', exact: true, component: props => requireAuth(PostsDetail, props), head: Head, sidebar: Sidebar, center: requireAuth },
  { path: '/topics', exact: true, component: props => requireAuth(Topics, props), head: Head, sidebar: Sidebar, center: requireAuth },
  { path: '/sign-in', exact: true, component: props => triggerEnter(SignIn, props), center: triggerEnter },
  { path: '**', component: NotFound, center: triggerEnter }
]
*/

const routeArr = [
  { path: '/', exact: true, component: Home, head: Head, sidebar: Sidebar, center: requireAuth },
  { path: '/posts', exact: true, component: Posts, head: Head, sidebar: Sidebar, center: requireAuth },
  { path: '/posts/:id', exact: true, component: PostsDetail, head: Head, sidebar: Sidebar, center: requireAuth },
  { path: '/topics', exact: true, component: Topics, head: Head, sidebar: Sidebar, center: requireAuth },
  { path: '/sign-in', exact: true, component: SignIn, center: triggerEnter },
  { path: '**', component: NotFound, center: triggerEnter }
]

let router = ({ userinfo }) => {

  // console.log(userinfo);

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
                    if (route.component) return <Route key={index} path={route.path} exact={route.exact} component={props => route.center(route.component, props)} />
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

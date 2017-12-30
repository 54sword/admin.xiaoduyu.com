import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch, Redirect } from 'react-router-dom'

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
import HeadMobile from '../components/mobile-head'


import CSSModules from 'react-css-modules'
import styles from './style.scss'

let signIn = false

// 登录验证
function requireAuth(Layout, props) {
  if (!signIn) { // 未登录
    return <Redirect to="/sign-in" />
  } else {
    return <Layout {...props} />
  }
}

// 进入路由
const triggerEnter = (Layout, props) => {
  return signIn ? <Redirect to="/" /> : <Layout {...props} />
}

const routeArr = [
  { path: '/', exact: true, component: props => requireAuth(Home, props), head: true },
  { path: '/posts', exact: true, component: props => requireAuth(Posts, props), head: true },
  { path: '/posts/:id', exact: true, component: props => requireAuth(PostsDetail, props), head: true },
  { path: '/topics', exact: true, component: props => requireAuth(Topics, props), head: true },
  { path: '/sign-in', exact: true, component: props => triggerEnter(SignIn, props) },
  { path: '**', component: NotFound, head: true }
]

let router = ({ userinfo }) => {

  if (userinfo && userinfo._id) {
    signIn = true
  }

  let _router = (<div className="flex-center">
      <div className="container-fluid">
        <div className="flex-left units-gap-big">

          <div className="hide-on-mobile" style={{width:'300px'}}>
            <Switch>
              {routeArr.map((route, index) => {
                if (route.head) {
                  return (<Route key={index} path={route.path} exact={route.exact} component={Head} />)
                }
              })}
            </Switch>
          </div>

          <div className="show-on-mobile">
            <Switch>
              {routeArr.map((route, index) => {
                if (route.head) {
                  return (<Route key={index} path={route.path} exact={route.exact} component={HeadMobile} />)
                }
              })}
            </Switch>
          </div>

          <div className="unit">
            <Switch>
              {routeArr.map((route, index) => (
                <Route key={index} path={route.path} exact={route.exact} component={route.component} />
              ))}
            </Switch>
          </div>



        </div>
      </div>
    </div>)

  // _router = CSSModules(_router, styles)

  return () => _router
}

export const RouteArr = routeArr
export const Router = router

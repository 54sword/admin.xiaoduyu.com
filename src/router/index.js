import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch, Redirect } from 'react-router-dom'


// import '../common/mobi.min.css'
import '../pages/global.scss'
// import '../common/load-demand'

/*** 非npm安装的依赖，使用在浏览器客户端上 ***/

// https://github.com/apvarun/toastify-js
// Toastify 全局的轻消息
import '../vendors/toastify-js/toastify.js'
import '../vendors/toastify-js/toastify.css'

// ArriveFooter 监听抵达页尾的事件
import '../vendors/arrive-footer.js'

/**
 * 懒加载图片、Dom
 * 使用方式
 * 给dom添加class="load-demand"、data-load-demand="<div></div> or <img />"
 **/
import '../vendors/load-demand'


import { generateAsyncRouteComponent } from '../pages/generateAsyncComponent.js';

// pages
// import Home from '../pages/home'
// import Posts from '../pages/posts'
// import PostsDetail from '../pages/posts-detail'
// import Topics from '../pages/topics'
// import FormTopic from '../pages/form-topic'
// import SignIn from '../pages/sign-in'
// import People from '../pages/people'
// import Comment from '../pages/comment'
// import Notification from '../pages/notification'
// import NotFound from '../pages/not-found'

// components
import Head from '../components/head'
import Sidebar from '../components/sidebar'

// const Head = generateAsyncRouteComponent({
//   loader: () => import('../components/head')
// })
//
// const Sidebar = generateAsyncRouteComponent({
//   loader: () => import('../components/sidebar')
// })

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
  { path: '/',               exact: true,
    // component: Home,
    component: generateAsyncRouteComponent({
      loader: () => import('../pages/home')
    }),
    head: Head, sidebar: Sidebar, enter: requireAuth },
  {
    path: '/posts',          exact: true,
    // component: Posts,
    component: generateAsyncRouteComponent({
      loader: () => import('../pages/posts')
    }),
    head: Head, sidebar: Sidebar, enter: requireAuth },
  {
    path: '/posts/:id',      exact: true,
    // component: PostsDetail,
    component: generateAsyncRouteComponent({
      loader: () => import('../pages/posts-detail')
    }),
    head: Head, sidebar: Sidebar, enter: requireAuth },
  {
    path: '/topics',         exact: true,
    // component: Topics,
    component: generateAsyncRouteComponent({
      loader: () => import('../pages/topics')
    }),
    head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/add-topic',      exact: true,
    // component: FormTopic,
    component: generateAsyncRouteComponent({
      loader: () => import('../pages/topic-form')
    }),
    head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/edit-topic/:id', exact: true,
    // component: FormTopic,
    component: generateAsyncRouteComponent({
      loader: () => import('../pages/topic-form')
    }),
    head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/peoples',         exact: true,
    // component: People,
    component: generateAsyncRouteComponent({
      loader: () => import('../pages/peoples')
    }),
    head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/people/:id',         exact: true,
    // component: People,
    component: generateAsyncRouteComponent({
      loader: () => import('../pages/people-detail')
    }),
    head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/comments',        exact: true,
    component: generateAsyncRouteComponent({
      loader: () => import('../pages/comments')
    }),
    head: Head, sidebar: Sidebar, enter: requireAuth },

  { path: '/user-notifications',   exact: true,
    // component: Notification,
    component: generateAsyncRouteComponent({
      loader: () => import('../pages/user-notifications')
    }),    head: Head, sidebar: Sidebar, enter: requireAuth },

  { path: '/notifications',   exact: true,
    component: generateAsyncRouteComponent({
      loader: () => import('../pages/notifications')
    }),
    head: Head, sidebar: Sidebar, enter: requireAuth },
  { path: '/sign-in',        exact: true,
    // component: SignIn,
    component: generateAsyncRouteComponent({
      loader: () => import('../pages/sign-in')
    }),
    enter: requireTourists },
  { path: '**',
    // component: NotFound,
    component: generateAsyncRouteComponent({
      loader: () => import('../pages/not-found')
    }),
    enter: triggerEnter }
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

        <div className="container-fluid">
          <Switch>
            {routeArr.map((route, index) => {
              if (route.component) return <Route key={index} path={route.path} exact={route.exact} component={props => route.enter(route.component, props)} />
            })}
          </Switch>
        </div>

        {/*
        <div className="flex-center">
          <div className="container-fluid">
            <div className="flex-left flex-wrap units-gap-big top-gap">

              <Switch>
                {routeArr.map((route, index) => (
                  <Route key={index} path={route.path} exact={route.exact} component={route.sidebar} />
                ))}
              </Switch>

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
        */}

    </div>)

  return () => _router
}

export const RouteArr = routeArr
export const Router = router

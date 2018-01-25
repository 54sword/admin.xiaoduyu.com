import React from 'react'
import PropTypes from 'prop-types'
// import { Route, Link } from 'react-router-dom'

import { setScrollPosition, saveScrollPosition } from '../actions/scroll'

import parseUrl from '../common/parse-url'
import connectReudx from '../common/connect-redux'

import Meta from '../components/meta'

export default (Component) => {

  Component = connectReudx(Component)

  class Shell extends React.Component {

    static defaultProps = {
      loadData: Component.loadData || null
    }

    static contextTypes = {
      router: PropTypes.object.isRequired
    }

    static mapStateToProps = (state) => {
      return {}
    }

    static mapDispatchToProps = { setScrollPosition, saveScrollPosition }

    constructor(props) {
      super(props)
      this.state = {}
    }

    // 组件加载完成
    componentWillMount() {

      // if (this.props.staticContext) {
      //   console.log(this.props.staticContext);
      //   console.log(this.props);
      // }

      const self = this
      const { search } = this.props.location
      this.props.location.params = search ? parseUrl(search) : null
      // console.log('进入组件')
    }

    // 组件加载完成
    componentDidMount() {
      // console.log('组件加载完成');
      this.props.setScrollPosition(this.props.location ? this.props.location.pathname : '')
    }
    
    // 更新组件
    componentDidUpdate() {
      // console.log('组件加载更新了');
    }

    // 组件被卸载
    componentWillUnmount() {
      // console.log('组件加载被卸载');
      this.props.saveScrollPosition(this.props.location ? this.props.location.pathname : '')
    }

    render() {
      return <Component {...this.props} />
    }

  }

  return connectReudx(Shell)
}

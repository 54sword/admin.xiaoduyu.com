import React from 'react'
import { Route, Link } from 'react-router-dom'


import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import { update } from '../../actions/account'

import parseUrl from '../common/parse-url'

import connectReudx from '../common/connect-redux'

const Shell = (Component) => {

  Component = connectReudx(Component)

  /*
  if (Component.mapStateToProps &&
    Component.mapDispatchToProps ) {

    Component = connect(Component.mapStateToProps,
      (dispatch)=>{

        let actions = {}

        for (let i in Component.actions) {
          actions[i] = bindActionCreators(Component.actions[i], dispatch)
        }

        return actions

      })(Component)
  }
  */

  class Shell extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        meta: {
          title:'test'
        }
      }
      this.setMeta = this.setMeta.bind(this)
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
      console.log('进入组件')


    }

    // 组件加载完成
    componentDidMount() {
      // console.log('组件加载完成');
    }

    // 更新组件
    componentDidUpdate() {
      // console.log('组件加载更新了');
    }

    // 组件被卸载
    componentWillUnmount() {
      // console.log('组件加载被卸载');
    }


    setMeta(meta) {
      // this.state.meta = meta
    }

    render() {

      const { meta } = this.state

      return (<div>
        {/* <DocumentMeta {...meta} /> */}
        <Component {...this.props} setMeta={this.setMeta} />
      </div>)
    }

  }

  Shell.defaultProps = {
    loadData: Component.loadData || null
  }

  Shell.contextTypes = {
    router: PropTypes.object.isRequired
  }

  Shell.propTypes = {

  }

  const mapStateToProps = (state) => {
    return {
      // goBack: getGoBack(state),
      // me: getProfile(state)
    }
  }

  const mapDispatchToProps = (dispatch, props) => {
    return {
    }
  }

  // console.log(Component.WrappedComponent);



  Shell = connect(mapStateToProps, mapDispatchToProps)(Shell)

  return Shell
}


export default Shell

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import arriveFooter from '../../../common/arrive-footer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadTopics } from '../../../actions/topic'
import { getTopicListByName } from '../../../reducers/topic'

import TopicItem from '../../topic-item'
import ListLoading from '../../list-loading'

import connectReudx from '../../../common/connect-redux'

export class TopicList extends Component {

  static mapStateToProps = (state, props) => {
    return {
      topicList: getTopicListByName(state, props.name)
    }
  }
  static mapDispatchToProps = { loadTopics }

  constructor(props) {
    super(props)
    this.state = {}
    this.triggerLoad = this._triggerLoad.bind(this)
  }

  componentDidMount() {

    // console.log(this);

    const self = this

    const { name, topicList } = this.props

    if (!topicList.data) {
      self.triggerLoad()
    }

    arriveFooter.add(name, ()=>{
      self.triggerLoad()
    })

  }

  componentWillUnmount() {
    const { name } = this.props
    arriveFooter.remove(name)
  }

  componentWillReceiveProps(props) {

    // const that = this
    //
    // if (this.props.name != props.name) {
    //
    //   setTimeout(()=>{
    //     that.triggerLoad(()=>{})
    //   }, 10)
    //
    // }
  }

  _triggerLoad(callback = ()=>{}) {
    const { name, filters, loadTopics } = this.props

    loadTopics({
      name,
      filters,
      callback
    })

  }

  render () {
    const { topicList } = this.props

    if (!topicList.data) {
      return (<div></div>)
    }

    return (<div className="container">
      <ul>
        {topicList.data.map((topic, index) => {
          return(<li key={topic._id}><TopicItem topic={topic} /></li>)
        })}
        <ListLoading
          loading={topicList.loading}
          more={topicList.more}
          handleLoad={this.triggerLoad}
          />
      </ul>
    </div>)
  }

}

/*
TopicList.propTypes = {
  loadTopics: PropTypes.func.isRequired,
  topicList: PropTypes.object.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    topicList: getTopicListByName(state, props.name)
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadTopics: bindActionCreators(loadTopics, dispatch)
  }
}
*/

export default connectReudx(TopicList)

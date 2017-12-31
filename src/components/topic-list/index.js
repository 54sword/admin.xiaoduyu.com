import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import arriveFooter from '../../common/arrive-footer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadTopics } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'

import TopicItem from '../topic-item'
import ListLoading from '../list-loading'

export class TopicList extends Component {

  constructor(props) {
    super(props)

    const { name, filters } = this.props
    this.state = {
      name: name,
      filters: filters
    }

    this.triggerLoad = this._triggerLoad.bind(this)
  }

  componentDidMount() {

    const self = this

    const { topicList } = this.props
    const { name } = this.state

    if (!topicList.data) {
      self.triggerLoad()
    }

    arriveFooter.add(name, ()=>{
      self.triggerLoad()
    })

  }

  componentWillUnmount() {
    arriveFooter.remove(name)
  }

  componentWillReceiveProps(props) {

    const that = this

    if (this.props.name != props.name) {

      this.setState({
        name: props.name,
        filters: props.filters
      })

      setTimeout(()=>{
        that.triggerLoad(()=>{})
      }, 10)

    }
  }

  _triggerLoad(callback = ()=>{}) {
    const { loadTopics } = this.props
    const { name, filters } = this.state

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

export default connect(mapStateToProps, mapDispatchToProps)(TopicList)

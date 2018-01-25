import React, { Component } from 'react'
import PropTypes from 'prop-types'

import connectReudx from '../../../common/connect-redux'
import { loadPeopleList } from '../../../actions/people'
import { getPeopleListByName } from '../../../reducers/people'

import PeopleItem from '../list-item'
import ListLoading from '../../list-loading'

export class PeopleList extends Component{

  static propTypes = {
    loadPeopleList: PropTypes.func.isRequired,
    peopleList: PropTypes.object.isRequired
  }

  static mapStateToProps = (state, props) => {
    return {
      peopleList: getPeopleListByName(state, props.name)
    }
  }

  static mapDispatchToProps = { loadPeopleList }

  constructor(props) {
    super(props)
    this.state = {}
    this.load = this.load.bind(this)
  }

  componentDidMount() {
    const { peopleList } = this.props
    if (!peopleList.data) this.load()
    ArriveFooter.add(name, this.load)
  }

  componentWillUnmount() {
    const { name, type } = this.props
    ArriveFooter.remove(name)
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      this.props = props
      const { name, filters, loadPeopleList } = props
      loadPeopleList({ name, filters, restart: true })
    }
  }

  load(callback) {
    const { name, filters, loadPeopleList } = this.props
    loadPeopleList({ name: name, filters: filters })
  }

  render () {

    const { peopleList } = this.props

    if (!peopleList.data) return ''

    const { data, loading, more } = peopleList

    // console.log(loading);

    return (<div>
      {data.map(people=>{
        return (<div key={people._id}>
            <PeopleItem people={people} />
          </div>)
      })}
      <ListLoading loading={loading} more={more} handleLoad={this.load} />
    </div>)

  }

}

export default connectReudx(PeopleList)

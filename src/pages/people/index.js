import React from 'react'
import CSSModules from 'react-css-modules'

import styles from './style.scss'

import Shell from '../shell'
import PeopleList from '../../components/people-list'

export class People extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    return(<div>
      <div>
        <h1>用户</h1>
      </div>
      <PeopleList
        name="home"
        filters={{}}
        />
    </div>)
  }

}

People = CSSModules(People, styles)

export default Shell(People)

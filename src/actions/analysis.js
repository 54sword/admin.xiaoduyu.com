import Ajax from '../common/ajax'

// import grapgQLClient from '../common/grapgql-client'

export function loadSummary({ name, filters = { query: {}, update: {}, options: {} } }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken




    // console.log('1233');

    return Ajax({
      url: '/analysis/summary',
      type: 'post',
      data: filters,
      headers: { 'AccessToken': accessToken }
    }).then(result => {
      // console.log(result)

      if (result && result.success) {
        dispatch({
          type: 'SET_ANALYSIS_LIST_BY_NAME',
          name,
          data: result.data
        })
      }

    })
  }
}

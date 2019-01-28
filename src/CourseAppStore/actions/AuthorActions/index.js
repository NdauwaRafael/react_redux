/**
 * Created by Raphael Karanja on 2019-01-28.
 */
import * as types from '../ActionTypes'
import authorAPI from  '../../../API/AuthorApi';

export function loadAuthorsSuccess(authors) {
    return {
        type: types.LOAD_AUTHORS_SUCCESS,
        authors
    }
}

export function loadAuthors() {
    return function (dispatch) {
        return authorAPI.getAllAuthors()
            .then(authors=>{
                dispatch(loadAuthorsSuccess(authors))
            }, error=>{

            })
    }
}
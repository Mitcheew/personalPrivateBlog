const initialState = {
    name: '',
    profile_pic: '',
    user_id: ''
}

// types
const UPDATE_USER = 'UPDATE_USER';

// action creators
export function updateUser(data) {
    return {
        type: UPDATE_USER,
        payload: data
    }
}

// reducer
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_USER:
            return Object.assign({}, state, { 
                name: action.payload.name,
                profile_pic: action.payload.profile_pic,
                user_id: action.payload.user_id
            })
        default:
            return state;
    }
}

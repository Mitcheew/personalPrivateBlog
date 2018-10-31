const initialState = {
    display_name: '',
    profile_pic: '',
    user_id: 0,
    email: '',
    approved: false,
    isadmin: false
}

// types
const UPDATE_USER = 'UPDATE_USER';
const LOGOUT = 'LOGOUT';

// action creators
export function updateUser(data) {
    return {
        type: UPDATE_USER,
        payload: data
    }
}

export function logout(data) {
    return {
        type: LOGOUT
    }
}

// reducer
export default function reducer(state = initialState, action) {
    let { payload, type } = action;
    switch (type) {
        case UPDATE_USER:
            return Object.assign({}, state, {
                display_name: payload.display_name,
                profile_pic: payload.profile_pic,
                user_id: payload.user_id,
                email: payload.email,
                approved: payload.approved,
                isadmin: payload.isadmin
            });
        case LOGOUT:
            return Object.assign({}, state, {
                display_name: initialState.display_name,
                profile_pic: initialState.profile_pic,
                user_id: initialState.user_id,
                email: initialState.email,
                approved: initialState.approved,
                isadmin: initialState.isadmin
            });
        default:
            return state;
    }
}

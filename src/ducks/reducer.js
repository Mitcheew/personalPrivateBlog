import noImg from '../images/noImage.jpg'

const initialState = {
    display_name: '',
    profile_pic: noImg,
    user_id: 0,
    email: '',
    approved: false,
    isadmin: false
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
    let { payload, type } = action;
    console.log(type)
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
        default:
            return state;
    }
}

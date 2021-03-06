import{takeEvery, takeLatest, take, call, fork, put} from 'redux-saga/effects';
import * as actions from '../actions/users';
import* as api from '../api/users';

function* getUsers(){
    try{
        const result = yield call(api.getUsers);
        console.log(result);
        yield put(actions.getUsersSuccess({
            items: result.data.data
        }));
    }catch(e){

    }
}

function* watchGetUsersRequest(){
    yield takeEvery(actions.Types.GET_USERS_REQUEST, getUsers);
}
function* createUser(action){
    console.log(action);
    try{
        yield call(api.createUser, {firsName: action.payload.firstName, lastName: action.payload.lastName});
        yield call(getUsers);
    }catch(e){

    }

}

function* watchCreateUserRequest(){
    yield takeLatest(actions.Types.CREATE_USER_REQUESTS, createUser);
}

function* deleteUser({userId}){
    try{
        yield call(api.deleteUser, userId);
        yield call (getUsers);
    }catch(e){

    }
}

function* watchDeleteUserRequest(){
    while(true){
        const action = yield take(actions.Types.DELET_USER_REQUEST);
        yield call(deleteUser, {
            userId: action.payload.userId
        });

    }
}

const usersSagas = [
    fork(watchGetUsersRequest),
    fork(watchCreateUserRequest),
    fork(watchDeleteUserRequest)

];

export default usersSagas;
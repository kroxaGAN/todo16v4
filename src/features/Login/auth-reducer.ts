import {Dispatch} from "redux";
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {setAppStatusAC} from "../../app/app-reducer";
import {addTodolistAC} from "../TodolistsList/todolists-reducer";
import {handleServerAppError} from "../../utils/error-utils";

const initialState={
    isLogined:false,
    isInitialized:false
}
type initialStateType=typeof initialState


export const authReducer = (state: initialStateType=initialState, action: AuthReducerType) => {
    switch (action.type) {
        case 'AUTH/LOGIN-CHANGE': {
            return {...state,isLogined:action.value}
        }
        case "AUTH/LOADING-CHANGE":{
            return {...state,isInitialized:action.isLoading}
        }
        default:
            return state
    }
}

const authAC = (value:boolean) => {
    return {
        type: 'AUTH/LOGIN-CHANGE', value
    }as const
}
const changeInitializedAC=(isLoading:boolean)=>{
    return{
        type:'AUTH/LOADING-CHANGE',isLoading
    }as const
}

export const authTC=(data:LoginParamsType)=>(dispatch:Dispatch)=>{
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then((res)=>{
            if(res.data.resultCode===0){
                dispatch(authAC(true))
                dispatch(setAppStatusAC('succeeded'))
            }

        })
        .catch((err)=>{
            dispatch(setAppStatusAC('failed'))
        })
}
export const authorizeMeTC=()=>(dispatch:Dispatch)=>{
    dispatch(setAppStatusAC('loading'))
    authAPI.me()
        .then((res)=>{
            if(res.data.resultCode===0){
                dispatch(authAC(true))
                dispatch(setAppStatusAC('succeeded'))
            }
        })
        .catch((err)=>{
            dispatch(setAppStatusAC('failed'))
        })
        .finally(()=>{
            dispatch(changeInitializedAC(true))
            dispatch(setAppStatusAC('failed'))
        })
}
export const logOutTC=()=>(dispatch:Dispatch)=>{
    authAPI.logout()
        .then((res)=>{
            dispatch(authAC(false))
        })
}

export type AuthReducerType = ReturnType<typeof authAC> | ReturnType<typeof changeInitializedAC>

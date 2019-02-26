import Mock from "mockjs"
import data from "./data.json"


Mock.mock('/info',{
    code: 0,
    codeMsg: "success",
    data:data.songs
})

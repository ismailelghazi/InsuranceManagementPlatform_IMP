import { lazy } from "solid-js";

let routes = [
    {
        path:"/login",
        component:lazy(()=>import('./Login'))
    },
    {
        path:"/",
        component:lazy(()=>import('./Intro'))
    },
    {
        path:"/uploadExcel",
        component:lazy(()=>import('./UploadExcel'))
    },
];

export default routes;

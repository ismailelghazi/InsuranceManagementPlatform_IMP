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
];

export default routes;

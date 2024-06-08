import { lazy } from "solid-js";

let routes = [
    {
        path: "/login",
        component: lazy(() => import('./Pages/Login'))
    },
    {
        path: "/",
        component: lazy(() => import('./Pages/Intro'))
    },
    {
        path: "/uploadExcel",
        component: lazy(() => import('./Pages/UploadExcel'))
    },
    {
        path: "/assurer",
        component: lazy(() => import('./Pages/index'))
    },
    {
        path: "/product",
        component: lazy(() => import('./Pages/products'))
    }, 
    {
        path: "/add-reglement/:id",
        component: lazy(() => import('./Pages/AddReglement'))
    },
    {
        path:"/reglement",
        component:lazy(()=> import('./Pages/reglement'))
    },
    {
        path:"/etat",
        component:lazy(()=>import('./Pages/etat'))
    },
    {
        path:"/details/:cin",
        component:lazy(()=>import('./Pages/details.jsx'))
    },
    {
        path:"/logout",
        component:lazy(()=>import('./Pages/Logout'))
    },  {
        path:"/etat/caisse",
        component:lazy(()=>import('./Pages/Logout'))
    },  {
        path:"/etat/credit",
        component:lazy(()=>import('./Pages/Logout'))
    },
];

export default routes;

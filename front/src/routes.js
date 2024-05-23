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
];

export default routes;

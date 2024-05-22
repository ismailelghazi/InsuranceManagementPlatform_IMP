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
        component: lazy(() => import('./Pages/Assurer/index'))
    },
    {
        path: "/product",
        component: lazy(() => import('./Pages/Assurer/products'))
    },
];

export default routes;

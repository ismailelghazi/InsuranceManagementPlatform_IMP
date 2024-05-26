import { useNavigate } from "@solidjs/router";

function EmptyIntro(){
    const navigate=useNavigate();
    localStorage.clear()
    // here later on i'll check if he's authorized or not based if we have a bearer token stored in our store
    navigate('/login');
}
export default EmptyIntro;

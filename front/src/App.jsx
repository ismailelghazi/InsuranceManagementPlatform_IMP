
function Login() {
    // 
    return (
        <div class="w-screen h-screen bg-cyan-100 flex justify-center items-center">
            <div class="login-container w-1/3 h-1/4 bg-blue-300 flex flex-col items-center py-4">
                <h1 class="font-bold text-4xl">Login</h1>
                <form class="flex flex-col w-3/4 gap-4">
                    <div class="input-group flex flex-col">
                        <label for="email">Email:</label>
                        <input type="text" name="email" />
                    </div>
                    <div class="input-group flex flex-col">
                        <label for="password">Password:</label>
                        <input type="password" name="password"/>
                    </div>
                    <button type="submit" class="w-1/2 py-2 rounded bg-blue-950 text-white mx-auto">Submit</button>
                </form>
            </div>
          </div>
    );
}

export default Login;

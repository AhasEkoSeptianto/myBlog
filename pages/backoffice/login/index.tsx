import { Fragment, useState } from "react";
import { ParticlesContainer } from "src/components/lib/particle";
 

export default function BackofficeLogin(){
    const [ form, setForm ] = useState({
        email: '',
        password: '',
        remember_me: false
    })

    const SubmitLogin = (e:any) => {
        e.preventDefault()

        
    }


    return (
        <Fragment>
            <section className="h-screen w-full relative">
                <div className="bg-bgLoginBAckoffice2 w-screen h-full bg-cover bg-no-repeat bg-center blur-sm">

                </div>

                <div className="absolute top-0 p-32 w-screen h-full z-50">
                    <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800 backdrop-blur-sm bg-gray-300/80 rounded">
                        <div className="md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
                            <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                                className="w-full"
                                alt="Phone image"
                            />
                        </div>
                        <div className="md:w-8/12 lg:w-5/12">
                            <div className="mb-10">
                                <p className="font-semibold text-2xl">Welcome Back,</p>
                                <p className="font-semibold text-2xl">please login with your username or password</p>
                            </div>
                            <form onSubmit={SubmitLogin}>
                                {/* <!-- Email input --> */}
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        placeholder="Email address"
                                        onChange={({ target }) => setForm({ ...form, email: target.value })}
                                    />
                                </div>

                                {/* <!-- Password input --> */}
                                <div className="mb-6">
                                    <input
                                        type="password"
                                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        placeholder="Password"
                                        onChange={({ target }) => setForm({ ...form, password: target.value })}
                                    />
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <div className="form-group form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                        id="exampleCheck2"
                                        checked={form.remember_me}
                                        onChange={(e) => setForm({ ...form, remember_me: e.target.checked })}
                                        // checked
                                    />
                                    <label className="form-check-label inline-block text-gray-800" htmlFor="exampleCheck2"
                                        >Remember me</label
                                    >
                                    </div>
                                    {/* <a
                                    href="#!"
                                    className="text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 duration-200 transition ease-in-out"
                                    >Forgot password?</a
                                    > */}
                                </div>

                                {/* <!-- Submit button --> */}
                                <button
                                    type="submit"
                                    className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                >
                                    Log in
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            </section>  
            
        </Fragment>
    )
}
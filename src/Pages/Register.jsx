import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { registerUser } from "../services/authServices";

const Register = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // validate the password
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        try {
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };

            const response = await registerUser(userData);
            toast.success(response.message);

            // redirect the user to the login page
            navigate("/login");

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again...";
            toast.error(errorMessage);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-white p-4">
            <div className="text-center mb-6">
                <Link
                    to="/"
                    className="flex items-center justify-center space-x-2"
                >
                    <div
                        className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center"
                    >
                        <span
                            className="text-white font-bold text-2xl"
                        >JP</span>
                    </div>
                </Link>

                <h2
                    className="mt-4 text-3xl font-extrabold text-gray-900"
                >Create your account</h2>
                <p
                    className="mt-2 text-sm text-gray-600"
                >
                    Or{' '}
                    <Link
                        to="/login"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >sign in to your account</Link>
                </p>
            </div>

            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <form className="space-y-6"
                    onSubmit={handleRegister}
                >
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Register
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        By signing up, you agree to our{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-500">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-500">
                            Privacy Policy
                        </a>.
                    </p>
                </div>

                <div
                    className="mt-6 text-center"
                >
                    <Link to="/"
                        className="text-sm text-blue-600 hover:text-blue-500"
                    >Back to Home</Link>
                </div>
            </div>
        </div>
    )
}

export default Register;
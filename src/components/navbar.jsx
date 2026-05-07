import { Link } from "react-router";

const Navbar = () => {
    const { isAuthenticated, user } = {
        isAuthenticated: false, user: {
            name: 'john',
            role: 'user'
        }
    };

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to={"/"} className="flex-items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">JP</span>
                        </div>
                    </Link>

                    <div>
                        <Link
                            to={"/"}
                            className="text-gray-600 hover:text-blue-600 font-medium"
                        >
                            Home
                        </Link>

                        <div className="inline-block ml-6">
                            {
                                !isAuthenticated ? (
                                    <>
                                        <Link
                                            to={"/login"}
                                            className="text-gray-600 hover:text-blue-600 font-medium mr-4"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to={"/register"}
                                            className="ml-6 text-white bg-blue-600 hover:bg-blue-700 font-medium px-4 py-2 rounded-lg"
                                        >
                                            Register
                                        </Link>
                                    </>
                                ) : (
                                    <div className="relative inline-block text-left">
                                        <div className="relative inline-block text-left group">
                                            <button className="w-full px-4 py-2 text-left bg-white hover:bg-gray-100 flex items-center space-x-2 group">
                                                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center">
                                                    {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                </span>
                                                <span className="font-medium text-gray-600 hover:text-blue-600">
                                                    {user ? user.name : 'User'}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {user?.role}
                                                </span>
                                            </button>

                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                                <div className="py-1">
                                                    <Link
                                                        to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard'}
                                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Dashboard
                                                    </Link>
                                                    <button
                                                        className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </nav >
    )
}

export default Navbar;
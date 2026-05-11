import { redirect } from "react-router";
import { clearUser, setUser } from "../redux/authSlice";
import store from "../redux/store";
import { getMe } from "../services/authServices";

export const userLoader = async () => {
    try {
        const response = await getMe();
        const user = response.user;

        store.dispatch(setUser(user));

        if (user.role !== 'user') {
            if (user.role === 'admin') {
                return redirect('/admin/dashboard');
            } else if (user.role === 'recruiter') {
                return redirect('/recruiter/dashboard');
            }

            return redirect('/login');
        }

        return response;
    } catch (error) {
        console.error('User loader error:', error);
        store.dispatch(clearUser());
        return redirect('/login');
    }
}

export const adminLoader = async () => {
    try {
        const response = await getMe();
        const user = response.user;

        store.dispatch(setUser(user));

        if (user.role !== 'admin') {
            if (user.role === 'user') {
                return redirect('/dashboard');
            } else if (user.role === 'recruiter') {
                return redirect('/recruiter/dashboard');
            }

            return redirect('/login');
        }

        return response;
    } catch (error) {
        console.error('Admin loader error:', error);
        store.dispatch(clearUser());
        return redirect('/login');
    }
}

export const recruiterLoader = async () => {
    try {
        const response = await getMe();
        const user = response.user;

        store.dispatch(setUser(user));

        if (user.role !== 'recruiter') {
            if (user.role === 'user') {
                return redirect('/dashboard');
            } else if (user.role === 'admin') {
                return redirect('/admin/dashboard');
            }

            return redirect('/login');
        }

        return response;
    } catch (error) {
        console.error('Recruiter loader error:', error);
        store.dispatch(clearUser());
        return redirect('/login');
    }
}
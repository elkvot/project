import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Job from './pages/Job';
import About from './pages/About';
import Admin from './pages/Admin';
import MyProfile from './pages/MyProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import NavigationBar from './components/NavigationBar';
import { AuthProvider } from './context/AuthContext';
import AdminOnly from './components/AdminOnly';
import UnauthorizedOnly from './components/UnauthorizedOnly';
import PostPage from './pages/PostPage';
import AuthorizedOnly from './components/AuthorizedOnly';
import Profile from './pages/Profile';
import UpdateProfileData from './pages/UpdateProfileData';
import PageNotFound from './pages/PageNotFound';

function App() {
	return (
		<div className='wrapper'>
			<div className='wrapper-content max-w-[1520px] w-full mx-auto'>
				<AuthProvider>
					<Router>
						<NavigationBar />
						<Routes>
							<Route path="/" element={<Main />} />
							<Route path="*" element={<PageNotFound />} />
							<Route path="/job" element={<Job />} />
							<Route path="/about" element={<About />} />
							<Route path="/admin" element={<AdminOnly returnMessage={true}><Admin /></AdminOnly>} />
							<Route path="/login" element={<UnauthorizedOnly returnMessage={true}><Login /></UnauthorizedOnly>} />
							<Route path="/register" element={<Register />} />
							<Route path="/myprofile" element={<AuthorizedOnly returnMessage={true}><MyProfile /></AuthorizedOnly>} />
							<Route path='/updateprofile' element={<AuthorizedOnly><UpdateProfileData /></AuthorizedOnly>} />
							<Route path="/posts/:id" element={<PostPage />} />
							<Route path='/profile/:username' element={<Profile />} />
						</Routes>
					</Router>
				</AuthProvider>
			</div>
		</div>
	);
}

export default App;
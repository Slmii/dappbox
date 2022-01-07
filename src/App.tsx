import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from 'components/layout';
import { RequireAuthentication } from 'components/require-authentication';
import { AuthenticatePage, FavoritesPage, HomePage } from 'pages';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route
						path='/*'
						element={
							<RequireAuthentication>
								<HomePage />
							</RequireAuthentication>
						}
					/>
					<Route
						path='/favorites'
						element={
							<RequireAuthentication>
								<FavoritesPage />
							</RequireAuthentication>
						}
					/>
					<Route path='/authenticate' element={<AuthenticatePage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;

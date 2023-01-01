import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Activities } from 'components/Activities';
import { Layout } from 'components/Layout';
import { RequireAuthentication } from 'components/RequireAuthentication';
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
								<Activities />
							</RequireAuthentication>
						}
					/>
					<Route
						path='/favorites'
						element={
							<RequireAuthentication>
								<FavoritesPage />
								<Activities />
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

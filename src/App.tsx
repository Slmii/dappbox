import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from 'components/layout';
import { RequireAuthentication } from 'components/require-authentication';
import { AuthenticatePage, HomePage } from 'pages';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route
						index
						element={
							<RequireAuthentication>
								<HomePage />
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

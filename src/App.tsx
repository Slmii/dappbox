import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Authenticate } from 'components/authenticate';
import { Layout } from 'components/layout';
import { RequireAuthentication } from 'components/require-authentication';
import { HomePage } from 'pages';

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
					<Route path='/authenticate' element={<Authenticate />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
